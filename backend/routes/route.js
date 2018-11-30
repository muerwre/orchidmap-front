const express = require('express');
const post = require('./route/post');
const get = require('./route/get');

const router = express.Router();

router.post('/', post);
router.get('/', get);

module.exports = router;
