const mongoose = require('mongoose');
const mongojs = require('mongojs');

const options = { useNewUrlParser: true };
const db = mongoose.connection;
require('mongoose').Promise = global.Promise;

let MONGO_URL: string;
const MONGO_LOCAL_URL = 'mongodb://localhost/hw_dev';

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, options).then(() => {
      MONGO_URL = process.env.MONGODB_URI;
      db.once('open', () => {
          console.log(`Connected to: ${MONGO_URL}`);
      });
  });
} else {
  mongoose.connect(MONGO_LOCAL_URL, options).then(() => {
      MONGO_URL = MONGO_LOCAL_URL;
      db.once('open', () => {
          console.log(`Connected to: ${MONGO_URL}`);
      });
  });
}

db.on('error', (error: any) => {
    console.log(`Mongoose Error:\n${error}`);
});

module.exports = db;
