const express = require('express');
const bodyParser = require('body-parser');
const mw = require('./mw');
const { createValidationMw } = require('../src');

const validateReqVar = createValidationMw({
  schema: require('./models'),
  debug: true
});

const app = express();
app.use(bodyParser.json());

app.get('/blog-posts',
  mw.checkUserIsLoggedIn,
  mw.getUsersPosts,
  validateReqVar('allPosts', '/responses/blogPosts'),
  mw.sendReqVar('allPosts')
);

app.post('/comment',
  mw.checkUserIsLoggedIn,
  validateReqVar('body', '/requests/newComment'),
  mw.saveComment,
  validateReqVar('comment', '/primitives/comment'),
  mw.sendReqVar('comment')
);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Magic happening on port', port);
});