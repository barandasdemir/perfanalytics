const express = require('express');
const Website = require('../model/website');
const Metric = require('../model/metric');
const { websiteExists } = require('../middlewares');

const router = express.Router();

router.get('/', async (req, res) => {
  const data = await Metric.find();
  res.json({
    success: true,
    data,
  });
});

router.get('/:id', websiteExists, async (req, res) => {
  const { id: siteID } = req.params;
  const { start, end } = req.query;

  const analytics = await Metric.find({
    siteID,
    createdAt: {
      $gte: start || Date.now() - 1000 * 60 * 30,
      $lt: end || Date.now(),
    },
  });
  return res.json({
    success: true,
    data: {
      siteID,
      analytics,
    },
  });
});

router.post('/:id', websiteExists, async (req, res) => {
  const { id: siteID } = req.params;
  const model = new Metric({ ...req.body, siteID });
  const invalid = model.validateSync();

  if (invalid) {
    return res.status(400).json({
      success: false,
      error: {
        type: 'Validation',
        message: invalid.message,
      },
    });
  }

  await model.save();
  await Website.findOneAndUpdate({ _id: siteID }, { $inc: { metricCount: 1 } });

  const analytics = await Metric.find({
    siteID,
    createdAt: {
      $gte: Date.now() - 1000 * 60 * 30,
      $lt: Date.now(),
    },
  });
  return res.json({
    success: true,
    data: {
      siteID,
      analytics,
    },
  });
});

module.exports = router;
