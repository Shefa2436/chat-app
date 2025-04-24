const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db'); 
const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.send('Всички полета са задължителни.');

  const hash = await bcrypt.hash(password, 10);
  db.run(`INSERT INTO users(username, password) VALUES(?, ?)`, [username, hash], (err) => {
    if (err) {
      return res.send('Грешка: Потребителското име вече съществува.');
    }
    res.redirect('/users/login');
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err || !user) return res.send('Невалидни потребителски данни.');

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send('Грешна парола.');

    req.session.user = { id: user.id, username: user.username };
    console.log('🔐 Влязъл потребител:', req.session.user); // <-- ВАЖНО!
    res.redirect('/');
  });
});


router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/users/login');
  });
});

module.exports = router;
