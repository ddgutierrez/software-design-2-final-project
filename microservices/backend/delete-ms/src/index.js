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
app.use(morgan('dev'));
app.use(express.json());

// Functions
async function deleteUser(req, res) {
  const { idNumber } = req.body;
  try {
    const user = await User.findOneAndDelete({ idNumber: idNumber });
    if (user === null || user.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      user.delete
      console.log('user deleted');
      const action = 'eliminar usuario';
      const newLog = new Log({ action, idNumber });
      await newLog.save();
      res.status(200).json(user);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.log('Error while running deleteUser(req, res)');
  }
}

// Routes
app.delete('/', deleteUser);
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

