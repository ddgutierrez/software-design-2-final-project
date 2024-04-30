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
    const action = 'crear usuario';
    const newLog = new Log({ action, idNumber });
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

async function updateUser(req, res) {
  const {  idType, idNumber, firstName, middleName, lastName, birthDate, gender, email, phone, photo, } =
    req.body;
  console.log(idNumber);
  console.log(req.body);
  try {
    const user = await User.findOneAndUpdate(
      { idNumber: idNumber, deleted: false },
      { idType, firstName, middleName, lastName, birthDate, gender, email, phone, photo },
      { new: true }
    );
    if (user === null || user.length === 0) {
      res.status(404).json({ error: 'User not found' });
      console.log('User not found (update)');
      console.log(idNumber);
    } else {
      console.log('User updated succesfully');
      const action = 'actualizar usuario';
      const newLog = new Log({ action, idNumber });
      await newLog.save();
      console.log(user);
      res.status(200).json(user);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.log('Error while running updateUser(req, res)');
  }
}

async function deleteUser(req, res) {
  const { idNumber } = req.body;
  const update = { deleted: true };
  try {
    const user = await User.findOneAndUpdate({ idNumber: idNumber, deleted: false }, update, {
      new: true,
    });
    if (user === null || user.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
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

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
