const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { isUserLogged: req.isAuthenticated() });
});

module.exports = router;
