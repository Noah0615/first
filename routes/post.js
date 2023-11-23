const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { afterUploadImage, uploadPost, deletePost } = require('../controllers/post');
const { isLoggedIn } = require('../middlewares');
const router = express.Router();
const { Post, User } = require('../models');

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), uploadPost);

router.delete('/:id', isLoggedIn, deletePost);

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: [{
        model: User,
        attributes: ['id', 'nick'],
      }, 
      {
        model: User,
        attributes: ['id', 'nick'],
        as: 'Liker',
        through: 'PostLike'
      },
    ],
      order: [['createdAt', 'DESC']],
    });
    // console.log(posts)
    res.render('main', {
      title: 'NodeBird',
      twits: posts,
      // user: req.user,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/:id/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id }});
    if (post) {
      await post.addLiker(req.user.id);
      res.send('OK');
    } else {
      res.status(404).send('게시물을 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
