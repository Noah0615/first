const express = require('express');
const { apiLimiter, deprecated } = require('../middlewares'); // 경로는 실제 파일 위치에 따라 다를 수 있습니다.
const { verifyToken } = require('../middlewares');
const { createToken, tokenTest, getMyPosts, getPostsByHashtag } = require('../controllers/v1');

const router = express.Router();

router.use(deprecated); // 이 라인을 추가합니다. 이 미들웨어는 모든 라우트에 적용됩니다.

// POST /v1/token
router.post('/token', apiLimiter, createToken); // apiLimiter 미들웨어를 추가합니다.

// POST /v1/test
router.get('/test', verifyToken, tokenTest);

// Get /v1/posts/my
router.get('/posts/my', verifyToken, getMyPosts);

// Get /v1/posts/hashtag/:title
router.get('/posts/hashtag/:title', verifyToken, getPostsByHashtag);

module.exports = router;
