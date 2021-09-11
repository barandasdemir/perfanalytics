const mongoose = require('mongoose');

async function connect() {
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  await mongoose.connect(process.env.MONGO_URI, opts);
}

async function disconnect() {
  await mongoose.disconnect();
}

module.exports = { connect, disconnect };
