const express = require('express');
const { generateZip } = require('../controllers/downloadController');
const downloadRouter = express.Router();

downloadRouter.post('/generate-zip', generateZip);

module.exports = { downloadRouter };