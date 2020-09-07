const bcrypt = require('bcrypt');

const LocalStrategy = require('passport-local').Strategy;

module.exports = function initialize(passport, usersDatabase) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      usersDatabase.findOne({ email: email }, (err, user) => {
        if (err) done(err);

        if (!user)
          return done(null, false, { message: 'This email in not registered' });

        if (bcrypt.compareSync(password, user.password))
          return done(null, user);
        else return done(null, false, { message: 'Password incorrect' });
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    usersDatabase.findOne({ _id: id }, (err, user) => {
      done(err, user);
    });
  });
};
