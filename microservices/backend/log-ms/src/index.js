const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Log = require('./models/log.model');

// Environment variables
const PORT = process.env.PORT;
dotenv.config();

// Settings
const app = express();
app.set('port', PORT);
app.set('json spaces', 2);

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Functions
async function getLogs(req, res) {
  const {idNumber, date, action} = req.query;
  const query = { };
  if (idNumber) query.idNumber = idNumber;
  if (date) query.createdAt = { $gte: date + "T00:00:00.000Z", $lt: date + "T23:59:59.999Z" };
  if (action) query.action = action;
  try {
    const log = await Log.find(query).sort({ createdAt: -1 });
    res.status(200).json(log);
    console.log("log read successfully!");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// Routes
app.get('/', getLogs);
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
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to database.');
  })
  .catch((err) => {
    console.log('There was an error when connecting to database!');
    console.log(err);
  });


