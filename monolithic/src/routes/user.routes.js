const { Router } = require('express');
const router = Router();

const {
  createUser,
  getUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');

router.post('/create/', createUser);
router.post('/', getUser);
router.get('/:id', getUserById);
router.get('/all', getAllUsers);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
