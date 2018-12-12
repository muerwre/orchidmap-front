const express = require('express');
const post = require('./route/post');
const get = require('./route/get');
const list = require('./route/list');

const router = express.Router();

router.post('/', post);
router.get('/', get);
router.get('/list', list);

module.exports = router;
