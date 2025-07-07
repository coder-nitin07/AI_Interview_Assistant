const express = require('express');
const { generateQuestion } = require('../controllers/questionController');
const questionRouter = express.Router();

questionRouter.post('/generate', generateQuestion);

module.exports = { questionRouter };