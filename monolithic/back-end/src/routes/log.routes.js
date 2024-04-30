const { Router } = require('express');
const router = Router();

const { 
    createLog, 
    getLogs,
 } = require('../controllers/log.controller');

router.post('/', createLog);
router.get('/', getLogs);

module.exports = router;
