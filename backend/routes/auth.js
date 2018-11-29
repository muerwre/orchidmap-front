const express = require('express');
const createGuest = require('./auth/guest');
const listUsers = require('./auth/list');

const router = express.Router();

router.get('/', listUsers);
router.get('/guest', createGuest);

module.exports = router;
