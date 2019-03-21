const express = require('express');
const post = require('./route/post');
const get = require('./route/get');
const list = require('./route/list');
const drop = require('./route/drop');
const patch = require('./route/patch');
const star = require('./route/star');

const router = express.Router();

router.post('/star', star);
router.post('/', post);
router.get('/', get);
router.patch('/', patch);
router.delete('/', drop);
router.get('/list', list);

module.exports = router;
