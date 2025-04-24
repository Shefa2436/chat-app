var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  console.log('🧠 Сесията е:', req.session.user); // <-- ВАЖНО!
  if (!req.session.user) {
    return res.redirect('/users/login');
  }

  res.render('index', {
    title: 'Чат приложение',
    user: req.session.user
  });
});


res.render('index', {
  title: 'Чат приложение',
  user: req.session.user
});



module.exports = router;
