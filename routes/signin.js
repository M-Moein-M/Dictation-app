const express = require('express');
const router = express.Router();

const { usersDatabase, wordsDatabase, passport } = require('../app.js');

router.get('/', (req, res) => {
  res.render('signin');
});

router.post(
  '/',
  passport.authenticate('local', {
    successRedirect: '/game',
    failureRedirect: '/signin',
    failureFlash: true,
  })
);

module.exports = router;
