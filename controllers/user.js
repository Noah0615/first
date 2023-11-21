const User = require('../models/user');
const Post = require('../models/post');

exports.follow = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) { // req.user.id가 followerId, req.params.id가 followingId
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.findAll({ where: { UserId: req.params.id } });
    res.json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.likePost = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    const post = await Post.findOne({ where: { id: req.params.id } });
    if (user && post) { // req.user.id가 likerId, req.params.id가 likedPostId
      await user.addLikedPost(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user or post');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};