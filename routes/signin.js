const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const { usersDatabase, wordsDatabase } = require('../app.js');

router.get('/', (req, res) => {
  res.render('signin');
});

router.post('/', (req, res) => {
  // use passport.authenticate here as middleware
  console.log('Sign in request');
  console.log(req.body);
});

module.exports = router;
