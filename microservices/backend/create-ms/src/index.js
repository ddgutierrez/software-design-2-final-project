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
async function createUser(req, res) {
  if(mongoose.connection.readyState == 0){
    res.status(504).json({ error: 'Database is not connected' });
    console.log('Database is not connected');
    return;
  }
  const {
    idType,
    idNumber,
    firstName,
    middleName,
    lastName,
    birthDate,
    gender,
    email,
    phone,
    photo,
  } = req.body;
  try {
    const newUser = new User({
      idType,
      idNumber,
      firstName,
      middleName,
      lastName,
      birthDate,
      gender,
      email,
      phone,
      photo,
    });
    await newUser.save();
    const action = 'crear usuario';
    const newLog = new Log({ action, idNumber });
    await newLog.save();
    res.status(201).json(newUser);
    console.log('User created');
  } catch (e) {
    res.status(400).json({ error: e.message });
    console.log(e.message);
    console.log('Error while running createUser(req, res)');
  }
}


app.post('/', createUser);
app.get('/status', (req, res) => {
  res.status(200).send('Server is running!');
});
app.use((req, res) => {
  res.status(404).json({ message: 'Not found.' });
  console.log(req);
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


