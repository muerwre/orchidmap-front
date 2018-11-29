const express = require('express');
const guest = require('./auth/guest');
const list = require('./auth/list');
const check = require('./auth/check');

const router = express.Router();

router.get('/', check);
router.get('/list', list);
router.get('/guest', guest);

module.exports = router;
