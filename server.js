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
  // TODO HANDLE STATUS CODE 500 ERRORS
  newFriend.save((err, friend) => {
    if (err) {
      res.status(400).json({errorMessage: err.message});
    } else {
      res.status(201).json(friend);
    }
  })
})

server.get('/api/friends', (req, res) => {
  friend.find({}).then((friends) => {
    res.status(200).json(friends)
  }).catch((error) => {
    res.status(500).json({error: 'The information could not be retrieved.'})
  })
})

server.get('/api/friends/:id', (req, res) => {
  const id = req.params.id;
  friend.findById(id).then((friend) => {
    res.status(200).json(friend)
  })
  .catch((error) => {
    res.status(404).json({error: 'The friend with the specified ID does not exist.'})
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
