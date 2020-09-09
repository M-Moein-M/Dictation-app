const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const flash = require('express-flash');

const { usersDatabase, wordsDatabase } = require('../app.js');

router.get('/', isNotAuthenticated, (req, res) => {
  res.render('signup');
});

router.post('/', isNotAuthenticated, (req, res) => {
  const renderObj = { signupErrors: [] };

  if (req.body.password.length < 6) {
    renderObj.signupErrors.push('Password must be at least 6 characters!');
    renderObj.email = req.body.email; // we dont want the user to type the eamil again
    renderObj.username = req.body.username;
  }

  usersDatabase.findOne({ email: req.body.email }, (err, docs) => {
    if (err) {
      console.log('Error in signup post request');
      console.log(err);
      res.redirect('signup');
    }
    if (docs != null) {
      // incase there's a user with same email
      renderObj.signupErrors.push('This email is already taken!');
      renderObj.email = null;
      renderObj.username = req.body.username;
    }
    if (renderObj.signupErrors.length != 0) {
      res.render('signup', renderObj);
    } else {
      // insert new user to database
      const { email, username, password } = req.body;

      // initialize new user
      const user = {
        email,
        username,
        password: bcrypt.hashSync(password, 10),
        userLevel: 1,
      };
      usersDatabase.insert(user);

      req.flash('signupSuccess', 'You may now sign-in with your account');
      res.render('signin');
    }
  });
});

// make sure user is not authenticated already
function isNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) next();
  else res.redirect('/');
}

module.exports = router;
