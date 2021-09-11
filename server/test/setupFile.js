const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGOTESTURI, {
    dbName: 'perfanalytics-test',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
