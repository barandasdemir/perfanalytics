const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    proto: { type: String, required: true },
    domain: { type: String, required: true },
    metricCount: { type: Number, default: 0 },
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

module.exports = mongoose.model('website', schema);
