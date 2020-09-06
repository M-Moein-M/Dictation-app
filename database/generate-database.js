// this file generates the database according to the data.json

const data = require('./data.json');
const path = require('path');
const Datastore = require('nedb');

const database = new Datastore({
  filename: path.join(__dirname, 'words-database.db'),
  autoload: true,
});
for (let i = 0; i < data.length; i++) {
  database.insert({ wordTag: i, word: data[i] });
}
