const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');
const Post = require('../models/post');
module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log('serialize');
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id : id },
    include : [{
      model: User,
      attributes: ['id', 'nick'],
      // 구분하기 위해 as 써줌
      as: 'Followings',
      through: 'Follow'
    }, {  
      model: User,
      attributes: ['id', 'nick'],
      as: 'Followers',
      through: 'Follow'
    },  
    {
      model: Post,
      attributes: ['id'],
      as: 'Liked',
      through: 'PostLike'
    }
  ]
  })
    .then(user => {
      console.log(user)
      return done(null, user)
    })
    // 이후 해당 유저는 req.user라는 속성으로 접근 가능하게 됨
    // 또한 로그인이 되어있다면 req.isAuthenticated() 값이 true
    .catch(err => done(err))
  });

  local();
  kakao();
};
