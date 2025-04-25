const OpenAI = require('openai');
const axios = require('axios'); // For DeepSeek and Gemini API calls
const config = require('../config'); // Assuming you have a config file for environment variables

// OpenAI Configuration
const openai = new OpenAI({
    apiKey: config.open_api_key,
  });

const getOpenAIResponse = async (systemPrompt, answers, persona) => {
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Persona: Smart, Young and Witty. Answers: ${JSON.stringify(answers)}` }
        ]
      });
    
      return response.choices[0].message.content;
};

// DeepSeek Configuration and Integration
const getDeepSeekResponse = async (answers, persona) => {
    const apiUrl = process.env.DEEPSEEK_API_URL;
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiUrl || !apiKey) {
        throw new Error('DeepSeek API URL or API Key is not set in environment variables.');
    }

    const response = await axios.post(
        apiUrl,
        {
            persona,
            answers,
        },
        {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        }
    );

    return response.data.result; // Adjust based on DeepSeek's API response structure
};

// Gemini Configuration and Integration
const getGeminiResponse = async (answers, persona) => {
    const apiUrl = process.env.GEMINI_API_URL;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiUrl || !apiKey) {
        throw new Error('Gemini API URL or API Key is not set in environment variables.');
    }

    const response = await axios.post(
        apiUrl,
        {
            persona,
            answers,
        },
        {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        }
    );

    return response.data.result; // Adjust based on Gemini's API response structure
};

// Main AI Response Function
exports.getAIResponse = async (systemPrompt, answers, persona) => {
    const provider = process.env.AI_PROVIDER || 'openai'; // Default to 'openai' if not set

    switch (provider.toLowerCase()) {
        case 'openai':
            return await getOpenAIResponse(systemPrompt, answers, persona);
        case 'deepseek':
            return await getDeepSeekResponse(systemPrompt, answers, persona);
        case 'gemini':
            return await getGeminiResponse(systemPrompt, answers, persona);
        default:
            throw new Error(`Unsupported AI provider: ${provider}`);
    }
};
