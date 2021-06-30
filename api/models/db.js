const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost:27017/hakbah';
const debug = require('../middleware/debug');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  debug.log('Mongoose connected to: ', dbURI);
});
mongoose.connection.on('error', (err) => {
  debug.log('Mongoose connected error : ', err);
});
mongoose.connection.on('disconnected', () => {
  debug.log('Mongoose disconnected', '');
});

