const express = require('express');
const router = express.Router();
const postRouter = require('./post.route');
const authRouter = require('./auth.route');

router.use('/posts', postRouter);


module.exports = router;