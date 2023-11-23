const express = require('express');
const { apiLimiter, deprecated } = require('../middlewares'); // 경로는 실제 파일 위치에 따라 다를 수 있습니다.
const { verifyToken } = require('../middlewares');
const { createToken, tokenTest, getMyPosts, getPostsByHashtag } = require('../controllers/v1');

const router = express.Router();

// POST /v1/token
router.post('/token', apiLimiter, deprecated, createToken); // apiLimiter 미들웨어를 deprecated 미들웨어 앞에 추가합니다.

// POST /v1/test
router.get('/test', verifyToken, tokenTest);

// Get /v1/posts/my
router.get('/posts/my', apiLimiter, verifyToken, getMyPosts); // apiLimiter 미들웨어를 deprecated 미들웨어 앞에 추가합니다.

// Get /v1/posts/hashtag/:title
router.get('/posts/hashtag/:title', verifyToken, getPostsByHashtag);

module.exports = router;
