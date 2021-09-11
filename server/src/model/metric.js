const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    siteID: { type: mongoose.Schema.Types.ObjectId, required: true },
    ttfb: { type: Number, required: true },
    fcp: { type: Number, required: true },
    domLoad: { type: Number, required: true },
    windowLoad: { type: Number, required: true },
    resources: [
      {
        name: { type: String, required: true },
        duration: { type: Number, required: true },
        type: { type: String, required: true },
        size: { type: Number, required: true },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

module.exports = mongoose.model('metric', schema);
