// controllers/previewController.js
const { v4: uuidv4 } = require('uuid');
const Preview = require('../models/previewModel');

// POST /preview - create preview
const createPreview = async (req, res) => {
  try {
    const { html, css, js } = req.body;

    if (!html && !css && !js) {
      return res.status(400).json({ message: 'At least one of HTML, CSS, or JS is required.' });
    }

    const previewId = uuidv4();

    await Preview.create({
      _id: previewId,
      html,
      css,
      js
    });

    const previewUrl = `${req.protocol}://${req.get('host')}/preview/${previewId}`;
    res.status(201).json({ message: 'Preview created', previewUrl, previewId });
  } catch (err) {
    console.error('Error creating preview:', err.message);
    res.status(500).json({ message: 'Failed to create preview' });
  }
};

// GET /preview/:id - fetch preview
const getPreviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const preview = await Preview.findById(id);

    if (!preview) {
      return res.status(404).json({ message: 'Preview not found or expired' });
    }

    res.status(200).json({ html: preview.html, css: preview.css, js: preview.js });
  } catch (err) {
    console.error('Error fetching preview:', err.message);
    res.status(500).json({ message: 'Failed to fetch preview' });
  }
};

module.exports = { createPreview, getPreviewById };
