const express = require('express');
const router = express.Router();
const { gradeEssay } = require('../services/gemini');

router.post('/', async (req, res) => {
  try {
    const { essay } = req.body;

    if (!essay || typeof essay !== 'string' || essay.trim().length === 0) {
      return res.status(400).json({ error: 'Essay text is required.' });
    }

    // Basic length check to avoid overly long requests
    if (essay.length > 20000) {
        return res.status(400).json({ error: 'Essay is too long. Please limit to 20,000 characters.' });
    }

    const result = await gradeEssay(essay);
    res.json(result);

  } catch (error) {
    console.error('Error in grading route:', error);
    res.status(500).json({ error: 'An error occurred while grading the essay.' });
  }
});

module.exports = router;
