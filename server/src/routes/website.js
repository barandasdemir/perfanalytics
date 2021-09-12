const express = require('express');
const Website = require('../model/website');
const { websiteExists } = require('../middlewares');

const router = express.Router();

// GET All Websites
router.get('/', async (req, res) => {
  const data = await Website.find();
  res.json({
    success: true,
    data,
  });
});

// GET Insert new website or return already registered site's info
router.post('/register', async (req, res) => {
  const { origin } = req.body;
  const domain = origin.substr(origin.lastIndexOf('/') + 1);
  const payload = { domain };

  const existing = await Website.exists(payload);
  if (existing) {
    const [data] = await Website.find(payload);
    res.json({
      success: true,
      data,
    });
  } else {
    const model = new Website(payload);
    const data = await model.save();
    res.json({
      success: true,
      data,
    });
  }
});

// DELETE Remove a website
router.delete('/:id', websiteExists, async (req, res) => {
  const { id: _id } = req.params;
  await Website.deleteOne({ _id });
  return res.end();
});

module.exports = router;
