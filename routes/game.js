const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('game');
});

router.post('/', (req, res) => {
  console.log(req.body.word);
  res.redirect('/game');
});

module.exports = router;
