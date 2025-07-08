const express = require('express');
const { generateQuestion, verifyAnswer, askAI } = require('../controllers/questionController');
const questionRouter = express.Router();

// questionRouter.post('/generate', generateQuestion);
// questionRouter.post('/verify', verifyAnswer);
questionRouter.post('/ask', askAI);

module.exports = { questionRouter };