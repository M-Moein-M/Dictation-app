const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv').config();

const { usersDatabase, wordsDatabase } = require('../app.js');

router.get('/', async (req, res) => {
  try {
    const word = 'producer';
    const apiURL = `https://api.wordnik.com/v4/word.json/${word}/audio?useCanonical=false&limit=1&api_key=${process.env.APP_KEY}`;
    const apiRes = await fetch(apiURL);
    const data = await apiRes.json();
    const audioURL = data[0].fileUrl;

    console.log(audioURL);

    res.render('game');
  } catch (error) {
    throw error;
  }
});

router.post('/', (req, res) => {
  console.log(req.body.word);
  res.redirect('/game');
});

module.exports = router;
