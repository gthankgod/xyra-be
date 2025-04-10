const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  response: { type: String }
}, { _id: false });

const User = new mongoose.Schema({
  email: { type: String, required: true },
  persona: { type: String, required: true },
  answers: [QuestionSchema],
  aiResponse: { type: String },
},{
    timestamps: true
});

module.exports = mongoose.model('User', User);
