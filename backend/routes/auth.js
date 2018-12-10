const express = require('express');
const guest = require('./auth/guest');
const list = require('./auth/list');
const check = require('./auth/check');
const vk = require('./auth/social/vk');
const vk_iframe = require('./auth/social/vk_iframe');

const router = express.Router();

router.get('/', check);
router.get('/list', list);
router.get('/guest', guest);
router.get('/social/vk', vk);
router.get('/social/vk_iframe', vk_iframe);

module.exports = router;
