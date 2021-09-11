const express = require('express');
const WebsiteModel = require('../model/website');
const { websiteExists } = require('../middlewares');

const router = express.Router();

// GET All Websites
router.get('/', async (req, res) => {
  const data = await WebsiteModel.find();
  res.json({
    success: true,
    data,
  });
});

// GET Insert new website or return already registered site's info
router.get('/register', async (req, res) => {
  const {
    protocol: proto,
    headers: { host },
  } = req;
  const [domain] = host.split(':');
  const payload = { domain, proto };

  const existing = await WebsiteModel.exists(payload);
  if (existing) {
    const [data] = await WebsiteModel.find(payload);
    res.json({
      success: true,
      data,
    });
  } else {
    const model = new WebsiteModel(payload);
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
  await WebsiteModel.deleteOne({ _id });
  return res.end();
});

module.exports = router;
