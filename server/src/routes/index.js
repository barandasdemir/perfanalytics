const express = require('express');
const websiteRouter = require('./website');
const analyticRouter = require('./analytic');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'PerfAnalytics - 👋🌎🌍🌏',
  });
});

router.use('/website', websiteRouter);
router.use('/analytic', analyticRouter);
module.exports = router;
