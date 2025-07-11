// routes/previewRoutes.js
const express = require('express');
const { createPreview, getPreviewById } = require('../controllers/previewController');

const router = express.Router();

router.post('/', createPreview);
router.get('/:id', getPreviewById);

module.exports = router;
