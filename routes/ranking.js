const express = require('express');
const router = express.Router();
const path = require('path');
const Datastore = require('nedb');
const rankingDatabase = new Datastore({
  filename: path.join(
    path.resolve(__dirname, '..'),
    'database',
    'ranking-database.db'
  ),
  autoload: true,
});

// if no global ranking exists
rankingDatabase.findOne({ rankLevel: 'global' }, (err, doc) => {
  if (err) console.log(err);
  else if (!doc) initNewGlobalRanking();
});

router.get('/', (req, res) => {
  rankingDatabase.findOne({ rankLevel: 'global' }, (err, doc) => {
    if (err) console.log(err);

    res.render('ranking', {
      rankings: doc.ranking,
      isUserLogged: req.isAuthenticated(),
      username: req.isAuthenticated() ? req.user.username : null,
    });
  });
});

function updateRanking(username, score) {
  rankingDatabase.findOne({ rankLevel: 'global' }, (err, doc) => {
    if (err) {
      console.log('Error at updateRanking function');
      console.log(err);
      return;
    }

    const leastScore = doc.ranking[doc.ranking.length - 1];
    if (!leastScore && score < leastScore) {
      return;
    } else {
      const newRanking = insertNewScore(username, score, doc);

      shave(newRanking); // remove extra players

      rankingDatabase.update(
        { rankLevel: 'global' },
        { $set: { ranking: newRanking } },
        { upsert: true },
        (err, numReplaced, upsert) => {
          if (err) {
            console.log('Error at updateRanking');
            console.log(err);
          }
        }
      );
    }
  });
}

function insertNewScore(username, score, doc) {
  let ranking = doc.ranking;

  for (let i = 0; i < ranking.length; i++) {
    if (!ranking[i]) break;
    if (ranking[i].username == username) {
      // change nothing if the user has a better score
      if (ranking[i].score > score) return ranking;
      else {
        // update the user score to his/her higher score
        ranking[i].score = score;
        return ranking;
      }
    }
  }

  let i = 0;
  while (ranking[i] != null && score < ranking[i].score) i++;
  // after while, i stands where new score should get inserted

  if (ranking[i] == null) ranking.splice(i, 1, { username, score });
  else ranking.splice(i, 0, { username, score });
  return ranking;
}

// initiating new global ranking in rankingDatabsae incase no ranking exists
function initNewGlobalRanking() {
  rankingDatabase.insert({
    rankLevel: 'global',
    ranking: [null, null, null, null, null, null, null, null, null, null],
  });
  console.log('New Global ranking initiated');
}

function shave(newRanking) {
  // we only want to show top 10 players
  const maxPlayers = 10;
  if (newRanking.length > maxPlayers) {
    // if the last two players don't have equal scores then remove the last one
    if (
      newRanking[maxPlayers] == null ||
      newRanking[maxPlayers].score != newRanking[maxPlayers - 1].score
    )
      newRanking.pop();
  }
  return newRanking;
}

module.exports = { router, updateRanking };
