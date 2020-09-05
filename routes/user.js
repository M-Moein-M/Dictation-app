const express = require('express');
const router = express.Router();

router.post('/game', (req, res) => {
  console.log(req.body.word);
  res.redirect('/');
});

module.exports = router;
