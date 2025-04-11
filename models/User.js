const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  response: { type: String }
}, { _id: false });

const User = new mongoose.Schema({
  email: { type: String, required: true },
  persona: { type: String, required: true },
  nickname: { type: String, required: true },
  answers: [QuestionSchema],
  aiResponse: {
    personality: { 
      type: String, 
      required: true 
    },
    description: {
      heading: { 
        type: String, 
        required: true 
      },
      content: { 
        type: String, 
        required: true 
      }
    },
    superpowers: [
      {
        type: String,
        required: true
      }
    ],
    challenges: [
      {
        type: String,
        required: true
      }
    ],
    find_balance: [
      {
        type: String,
        required: true
      }
    ]
  },
  retryCount: { type: Number, default: 0 },
}, {
  timestamps: true
});

module.exports = mongoose.model('User', User);
