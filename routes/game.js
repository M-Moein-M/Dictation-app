let userLevel = 1; // initial user streak
let currentWord;

const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv').config();

const { usersDatabase, wordsDatabase } = require('../app.js');
// wordsDatabase.findOne({ wordTag: userLevel.toString() }, (err, docs) =>
//   console.log(docs)
// );

router.get('/', async (req, res) => {
  wordsDatabase.findOne({ wordTag: userLevel }, async (err, doc) => {
    if (err) console.log(err);
    const word = (currentWord = doc.word);
    try {
      const apiURL = `https://api.wordnik.com/v4/word.json/${word}/audio?useCanonical=false&limit=1&api_key=${process.env.APP_KEY}`;
      const apiRes = await fetch(apiURL);
      const data = await apiRes.json();

      const audioURL = data[0].fileUrl;

      res.render('game', {
        jsFile: 'game.js',
        audioSrc: audioURL,
        currentLevel: userLevel,
      });
    } catch (error) {
      console.log('Error on catch phrase get /game route');
      console.log(error);
      res.redirect('/');
    }
  });
});

router.post('/', (req, res) => {
  console.log(req.body.word);
  if (req.body.word == currentWord) userLevel++;
  else restartUserLevel();
  res.redirect('/game');
});

function restartUserLevel() {
  userLevel = 1;
}

module.exports = router;
