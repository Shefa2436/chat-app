require('dotenv').config();

const fs = require('fs');
const path = require('path'); // ВАЖНО: трябва да е преди използването му
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Създай директория за SQLite файловете
const dbPath = path.join(__dirname, 'var', 'db');
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Сесии с SQLite
app.use(session({
  store: new SQLiteStore({
    db: 'sessions.sqlite',
    dir: dbPath
  }),
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 ден
    sameSite: 'lax',
    secure: false // Задай на true, ако използваш HTTPS
  }
}));

// Статични файлове
app.use(express.static(path.join(__dirname, 'public')));

// Пренасочване към login
app.get('/', (req, res) => {
  res.redirect('/users/login');
});

// Рутове
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Catch 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Стартирай сървъра
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Server listening on port ${PORT}`));

module.exports = app;
