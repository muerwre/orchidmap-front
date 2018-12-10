const express = require('express');
const guest = require('./auth/guest');
const list = require('./auth/list');
const check = require('./auth/check');
const vk = require('./auth/social/vk');
const iframe_vk = require('./auth/iframe/vk');

const router = express.Router();

router.get('/', check);
router.get('/list', list);
router.get('/guest', guest);
router.get('/social/vk', vk);
router.get('/iframe/vk', iframe_vk);

module.exports = router;
