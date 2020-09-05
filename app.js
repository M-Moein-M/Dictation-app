const express = require('express');
const exhbs = require('express-handlebars');
const path = require('path');

const app = express();
app.use(express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server is running at port ${port}`));

// database
const Datastore = require('nedb');
const usersDatabase = new Datastore({
  filename: path.join(__dirname, 'database', 'users-database.db'),
  autoload: true,
});
const wordsDatabase = new Datastore({
  filename: path.join(__dirname, 'database', 'words-database.db'),
  autoload: true,
});
console.log('Databasae loaded');

module.exports = { usersDatabase, wordsDatabase };

// temp user
app.use(tempUser);
function tempUser(req, res, next) {
  req.user = 1;
  next();
}

// html form middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// handlebar
app.engine('handlebars', exhbs());
app.set('view engine', 'handlebars');

// routes
app.use('/', require('./routes/index.js'));
app.use('/game', require('./routes/game'));
