const express = require('express');
const { isLoggedIn } = require('../middlewares');
const { follow, getPosts } = require('../controllers/user');
const Post = require('../models/post'); // Post 모델을 가져옵니다.

const router = express.Router();

// POST /user/:id/follow
router.post('/:id/follow', isLoggedIn, follow);

// GET /user/:id/posts
router.get('/:id/posts', isLoggedIn, getPosts);

// GET /user/:id/allposts
router.get('/:id/allposts', function(req, res) {
    // 'id' 파라미터를 가져옵니다.
    const userId = req.params.id;
  
    // 데이터베이스에서 해당 사용자의 게시글을 가져옵니다.
    Post.findAll({ where: { UserId: userId } })
      .then(posts => {
        // 게시글을 클라이언트에게 반환합니다.
        res.json(posts);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching posts.' });
      });
});

module.exports = router;
