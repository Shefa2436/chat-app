var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/users/login');
  }

  res.render('index', {
    title: 'Чат приложение - 127876',
    user: req.session.user
  });
});

module.exports = router;
