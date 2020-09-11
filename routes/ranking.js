const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('ranking', {
    rankings: [
      { rank: 1, name: 'Beorn', score: 200 },
      { rank: 2, name: 'Max', score: 120 },
    ],
    isUserLogged: req.isAuthenticated(),
    username: req.isAuthenticated() ? req.user.username : null,
  });
});

module.exports = router;
