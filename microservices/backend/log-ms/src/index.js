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
  if(mongoose.connection.readyState == 0){
    res.status(504).json({ error: 'Database is not connected' });
    console.log('Database is not connected');
    return;
  }
  const {idNumber, date, action} = req.query;
  const query = { };
  if (idNumber) query.idNumber = idNumber;
  if (date){
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    console.log(startDate.toJSON());
    console.log(endDate.toJSON());  
    const startDateUTC = new Date(startDate.getTime() +  ( 300 * 60000 ));
    const endDateUTC = new Date(endDate.getTime() +  ( 300 * 60000 ));
    console.log(startDateUTC.toJSON());
    console.log(endDateUTC.toJSON());  
    query.createdAt = { $gte: startDateUTC.toJSON(), $lt: endDateUTC.toJSON() };
  }
  if (action) query.action = action;

  startDate = new Date(date);
  endDate = new Date(date + "T23:59:59.999Z");


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
app.get('/status', (req, res) => {
  res.status(200).send('Server is running!');
});
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


