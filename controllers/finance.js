const { getAIResponse } = require('../services/ai');
const { createPDF } = require('../services/pdf');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');
const sendmail = require('../services/sendmail');

exports.submitAnswers = async (req, res) => {
    try {
        const { answers, persona, email, nickname, retry } = req.body;
    
        if (!answers || !persona || !email || !nickname) {
          return res.status(400).json({ status: 'error', message: 'Missing fields', data: null });
        }
    
        // Save user if not exists
        let user = await User.findOneAndUpdate(
          { email },
          { answers, persona, nickname },
          { new: true, upsert: true }
        );

        if(user.retryCount > 3) {
            return res.status(400).json({
                status: 'error',
                message: 'You have exceeded the maximum number of retries',
                data: null
            });
        }

        if(user && user.aiResponse.challenges.length && !retry) {
            return res.status(200).json({
                status: 'successful',
                message: 'Financial analysis already generated',
                data: { aiResponse: user.aiResponse, userId: user._id }
            });
        }
    
        const systemPrompt = `
            You are a certified financial advisor and behavioral finance expert who understands the industry-standard framework of money personalities: The Saver, The Spender, The Builder, and The Giver. These personalities are based on research by financial psychologists such as Dr. Brad Klontz and are widely adopted across financial education platforms.
            You are tasked with analyzing a user's financial behavior based on their poll responses and a selected dominant money personality. The user's answers reflect their tendencies in areas like saving, spending, investing, debt, and generosity.
            Use the characteristics of the selected personality to personalize your analysis. Your response must be in **valid JSON format** and include only the following fields:
            
            {
            "personality": "<one of: Saver, Spender, Builder, Giver>",
            "description": {
                "heading": "<A short, fun, or witty summary of this user's financial vibe. e.g. 'Money comes, money goes — why not enjoy it?'>",
                "content": "<A concise paragraph (2–4 sentences) that summarizes this user's financial mindset and behavior based on their persona and answers.>"
            },
            "superpowers": ["<3 bullet points highlighting strengths based on their answers and persona>"],
            "challenges": ["<3 bullet points identifying potential pitfalls or blind spots>"],
            "find_balance": ["<3 bullet points offering practical, empathetic advice tailored to their persona>"]
            }
            
            ✨ Use natural, human-friendly language in the values, but ensure the full response is valid JSON.
            
            🚫 Do NOT include any intro, headers, or explanations outside the JSON object.
            
            Personality reference guide:
            - Saver: Cautious, security-focused, avoids risk/debt, prefers saving.
            - Spender: Enjoys life now, values luxury, okay with debt, wants gratification.
            - Builder: Goal-driven, investor-minded, legacy-focused, risk-tolerant.
            - Giver: Generous, charitable, others-focused, avoids debt to help.
            
            Important: Be empathetic, clear, and actionable. Avoid judgmental language. Guide gently, speak like a helpful coach.
        `;
    
        const aiResponse = await getAIResponse(systemPrompt, answers, persona);
        user.aiResponse = JSON.parse(aiResponse);
        user.retryCount = user.retryCount ? user.retryCount + 1 : 1;
        await user.save();

        // Send email with the AI response
        let email_message = "";
        try {
            await sendmail.sendTransactionalMail({
                to: email,
                first_name: nickname,
                aiResponse: user.aiResponse
            });
        } catch (error) {
            console.log(error);
            email_message = error.message;
        }
       
    
        return res.status(200).json({
          status: 'successful',
          message: email_message || 'Financial analysis generated successfully',
          data: { aiResponse: JSON.parse(aiResponse), userId: user._id }
        });
    
      } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error', data: null });
      }
};

exports.generatePDF = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const filePath = await createPDF(user);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
