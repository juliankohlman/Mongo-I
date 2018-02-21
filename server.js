const express = require('express');
const helmet = require('helmet'); //look this pkg up
const cors = require('cors'); // look this pkg up
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = process.env.PORT || 5005;
const friend = require('./Friends/FriendModel.js');

const server = express();
// look these up!
// https://helmetjs.github.io/
// https://medium.com/trisfera/using-cors-in-express-cac7e29b005b
server.use(helmet());
server.use(cors());
server.use(bodyParser.json());

server.get('/', (req, res) => {
  res.status(200).json({ status: 'API Running'});
});

server.post('/api/friends', (req, res) => {
  const { firstName, lastName, age } = req.body;
  const newFriend = new friend(req.body);
  // let err = newFriend.validateSync();
  // if (firstName && lastName && age) {
  // }
  newFriend.save((err, friend) => {
    if (err) {
      res.status(400).json({errorMessage: err.message});
    } else {
      res.status(201).json(friend);
    }
  })
})

mongoose
  .connect('mongodb://localhost/FriendList')
  .then(db => {
    console.log('Successfully connected to MongoDB', db);
  }).catch(err => {
    console.error('database connection fubar')
  })

server.listen(port, () => {
  console.log(`API running on http://localhost:${port}.`);
})
