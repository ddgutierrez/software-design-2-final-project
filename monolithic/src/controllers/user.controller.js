const User = require('../models/user.model');
const Log = require('../models/log.model');

async function createUser(req, res) {
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
    const newLog = new Log('crear usuario', idNumber);
    await newLog.save();
    res.status(201).json(newUser);
    console.log('User created');
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.log('Error while running createUser(req, res)');
  }
}

async function getUser(req, res) {
  const { idNumber } = req.body;
  try {
    const user = await User.find({ idNumber, deleted: false });
    if (user === null || user.length === 0) {
      res.status(404).json({ error: 'User not found' });
      console.log('User not found');
    } else {
      res.status(200).json(user);
      console.log('User found');
      const newLog = new Log('leer usuario', idNumber);
      await newLog.save();
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.log('Error while running getUser(req, res)');
  }
}

async function updateUser(req, res) {
  const { idNumber } = req.params;
  const { 
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
    const user = await User.findOneAndUpdate(
      { _id: id, deleted: false },
      { firstName, 
        middleName, 
        lastName, 
        birthDate, 
        gender, 
        email, 
        phone, 
        photo,
      }
    );
    if (user === null || user.length === 0) {
      res.status(404).json({ error: 'User not found' });
      console.log('User not found (update)');
    } else {
      res.status(200).json(user);
      console.log('User updated succesfully');
      const newLog = new Log('actualizar usuario', user.idNumber);
      await newLog.save();
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.log('Error while running updateUser(req, res)');
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;
  const update = { deleted: true };
  try {
    const user = await User.findOneAndUpdate({ _id: id, deleted: false }, update);
    if (user === null || user.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(200).json(user);
      console.log('user deleted');
      const newLog = new Log('eliminar usuario', user.idNumber);
      await newLog.save();
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.log('Error while running deleteUser(req, res)');
  }
}

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
