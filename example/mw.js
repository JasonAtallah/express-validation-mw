module.exports = {
  checkUserIsLoggedIn(req, res, next) {
    return next();
  },

  getUsersPosts(req, res, next) {
    req.allPosts = [
      {
        title: 'Post one',
        body: 'This is my first post',
        comments: [
          {
            user: 'Jason',
            comment: 'Great post!'
          },
          {
            user: 'Alex',
            comment: 'I agree.'
          }
        ]
      }
    ];

    return next();
  },

  saveComment(req, res, next) {
    req.comment = {
      comment: req.body.comment,
      user: 'user123'
    };

    return next();
  },

  sendReqVar(name) {
    return (req, res) => {
      res.status(200).send(req[name]);
    };
  }
};
