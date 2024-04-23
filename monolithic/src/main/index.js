const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const expressListEndpoints = require('express-list-endpoints');

// Environment variables
const PORT = process.env.PORT || 3000;
const dotenv = require('dotenv');
dotenv.config();

// Settings
const app = express();
app.set('port', PORT);
app.set('json spaces', 2);

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/user', require('../routes/user.routes'));
app.use('/api/log', require('../routes/log.routes'));

// Endpoint for 404 error
app.use((req, res) => {
  res.status(404).json({ message: 'Not found.' });
});

// Starting the server
try {
  app.listen(app.get('port'), () => {
    console.log(`Server is running on port ${app.get('port')}`);
  });
} catch (e) {
  console.log(e.message);
}

// Connecting to database
mongoose
  .connect(
    'mongodb+srv://' +
      process.env.MONGO_USER +
      ':' +
      process.env.MONGO_PASS +
      '@dwb.dwiqlyu.mongodb.net/?retryWrites=true&w=majority',
  )
  .then(() => {
    console.log('Connected to database.');
  })
  .catch((err) => {
    console.log('There was an error when connecting to database!');
    console.log(err);
  });

const endpoints = expressListEndpoints(app);
console.log(endpoints)
