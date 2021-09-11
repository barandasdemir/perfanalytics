const WebsiteModel = require('./model/website');

async function websiteExists(req, res, next) {
  const { id } = req.params;
  try {
    const exists = await WebsiteModel.exists({ _id: id });
    if (exists) {
      next();
    } else {
      res.status(404).json({
        success: false,
        error: {
          type: 'Validation',
          message: `Could not find a website with id '${id}'`,
        },
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        type: 'Validation',
        message: 'Please check your website ID as it is invalid.',
      },
    });
  }
}

module.exports = {
  websiteExists,
};
