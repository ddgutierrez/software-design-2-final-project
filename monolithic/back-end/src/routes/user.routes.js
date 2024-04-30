const { Router } = require('express');
const router = Router();

const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');

router.post('/create/', createUser);
router.post('/', getUser);
router.patch('/update/', updateUser);
router.delete('/delete/', deleteUser);

module.exports = router;
