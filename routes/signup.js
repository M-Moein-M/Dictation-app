const express = require('express');
const router = express.Router();

const { usersDatabase, wordsDatabase } = require('../app.js');

router.get('/', (req, res) => {
  res.render('signup');
});

router.post('/', (req, res) => {
  console.log('signup request');
  console.log(req.body);
  res.render('signup'); // this must be render('signin')
});

module.exports = router;
