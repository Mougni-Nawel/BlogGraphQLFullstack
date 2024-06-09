const express = require('express');
const router = express.Router();
const { saveUser, login } = require('../controllers/auth.controller');

router.post('/register', saveUser);
router.post('/login', login);

module.exports = router;