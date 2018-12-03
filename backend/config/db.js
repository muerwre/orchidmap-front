const { CONFIG } = require('../../config/backend');

const {
  DB: {
    USER, PASSWORD, HOSTNAME, PORT, DATABASE
  }
} = CONFIG;

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(`mongodb://${USER}:${PASSWORD}@${HOSTNAME}:${PORT}/${DATABASE}`, { });
const database = mongoose.connection;

database.on('error', (err) => { console.error(`Database Connection Error: ${err}`); process.exit(2); });
database.on('connected', () => { console.info('Succesfully connected to MongoDB Database'); });
