require('dotenv').config();

const db = require('./db');
const app = require('./app');

const port = process.env.PORT || 3000;

db.connect().then(() => {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening: http://localhost:${port}`);
  });
});
