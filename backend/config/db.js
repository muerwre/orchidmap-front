const user = 'user';
const password = 'password';
const hostname = 'vault48.org';
const port = 27017;
const db = 'map';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(`mongodb://${user}:${password}@${hostname}:${port}/${db}`, { });
const database = mongoose.connection;

database.on('error', (err) => { console.error(`Database Connection Error: ${err}`); process.exit(2); });
database.on('connected', () => { console.info('Succesfully connected to MongoDB Database'); });

