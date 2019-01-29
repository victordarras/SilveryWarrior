const express = require('express');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/local', {useNewUrlParser: true});

var db = mongoose.connection;
const app = express()
const port = 3000
var player;
db.once('open', function() {
  var playerSchema = new mongoose.Schema({});
  player = mongoose.model('player', playerSchema);
})

app.get('/', (req, res) => {

  var players = [];
  player.find(function (err, players) {
    console.log('check')
    if (err) return console.error(err);
    players = players;
  })

  res.send(players)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
