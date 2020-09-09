const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const flash = require('express-flash');
require('dotenv').config();

const { usersDatabase, wordsDatabase } = require('../app.js');

router.get('/', isAuthenticated, async (req, res) => {
  wordsDatabase.findOne({ wordTag: req.user.userLevel }, async (err, doc) => {
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
        currentLevel: req.user.userLevel,
      });
    } catch (error) {
      console.log('Error on catch phrase get /game route');
      console.log(error);
      res.redirect('/');
    }
  });
});

router.post('/', isAuthenticated, (req, res) => {
  wordsDatabase.findOne(
    { wordTag: req.user.userLevel },
    (err, databaseWord) => {
      usersDatabase.findOne({ _id: req.user._id }, (err, user) => {
        if (err) {
          console.log('Error in /game post');
          console.log(err);
        }
        // if user inputed the word correctly
        if (req.body.word == databaseWord.word) {
          usersDatabase.update(
            { _id: user._id },
            { $set: { userLevel: user.userLevel + 1 } },
            {},
            (err, numReplaced) => {
              if (err) {
                console.log('Error in /game post');
                console.log(err);
              }
            }
          );
        } else {
          // wrong dictation
          usersDatabase.update(
            { _id: user._id },
            { $set: { userLevel: 1 } },
            (err, numReplaced) => {
              if (err) {
                console.log('Error in /game post');
                console.log(err);
              }
            }
          );
        }
      });

      res.redirect('/game');
    }
  );
});

// isAuthenticated middleware
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) next();
  else {
    req.flash('appMsg', 'Oops! You need to log-in to play the game');
    res.redirect('/signin');
  }
}

module.exports = router;
