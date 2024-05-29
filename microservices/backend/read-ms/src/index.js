const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/user.model');
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
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use(morgan('dev'));

// Functions
async function getUser(req, res) {
  const { idNumber } = req.body;
  try {
    const user = await User.find({ idNumber });
    if (user === null || user.length === 0) {
      res.status(404).json({ error: 'User not found' });
      console.log('User not found');
    } else {
      console.log('User found');
      const action = 'leer usuario';
      const newLog = new Log({ action, idNumber });
      await newLog.save();
      res.status(200).json(user);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.log('Error while running getUser(req, res)');
  }
}

// Routes
app.post('/', getUser);
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


