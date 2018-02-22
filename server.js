const express = require('express');
const helmet = require('helmet'); //look this pkg up
const cors = require('cors'); // look this pkg up
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = process.env.PORT || 5005;
const friend = require('./Friends/FriendModel.js');

const server = express();

// https://helmetjs.github.io/
// https://medium.com/trisfera/using-cors-in-express-cac7e29b005b
server.use(helmet());
server.use(cors());
server.use(bodyParser.json());

server.get('/', (req, res) => {
  res.status(200).json({ status: 'API Running'});
});

server.post('/api/friends', (req, res, next) => {
  const { firstName, lastName, age } = req.body;
  const newFriend = new friend(req.body);

  if (!firstName || !lastName || !age) {
    res.status(400).json({errorMessage: 'Please provide firstName, lastName and age for the friend.'})
  } else if (age < 1 || age > 120) {
    res.status(400).json({errorMessage: 'Age must be a whole number between 1 and 120'})
  } else {
    newFriend
      .save()
      .then(newFriend => {
        res.status(201).json(newFriend);
      })
      .catch(error => {
        res.status(500).json({ error: error.message});
      });
  }
  // newFriend.save((err, friend) => {
  //   if (err) {
  //     console.log(err);
  //     res.status(400).json({errorMessage: err.message});
  //   } else {
  //     res.status(201).json(friend);
  //   }
  // })
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

  friend.findById(id)
    .then((friend) => {
      if (friend) {
        res.status(200).json(friend)
      } else {
        res.status(404).json({ message: 'The friend with the specified ID does not exist.'})
      }
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(400).json({message: `The friend with the ID:${error.value} does not exist.`})
    } else {
      res.status(500).json({error: 'The information could not be retrieved.'})
    }
  })
})

server.delete('/api/friends/:id', (req, res) => {
  const id = req.params.id;
  friend.findByIdAndRemove(id)
    .then((friend) => {
      if (friend) {
        res.status(200).json(friend)
      } else {
        res.status(404).json({message: 'The friend with the specified ID does not exist.'})
      }
    })
    .catch((error) => {
      res.status(500).json({error: 'The friend could not be removed'});
    })
})

server.put('/api/friends/:id', (req, res) => {
    const friendData = req.body;
    const { firstName, lastName, age} = req.body;
    const id = req.params.id;
    friend.findByIdAndUpdate(id, friendData, {new: true})
      .then(updatedFriend => {
        if (!id) {
          res.status(404).json({message: 'The friend with the specified ID does not exist.'})
        } else if (!firstName || !lastName || !age) {
          res.status(400).json({errorMessage: 'Please provide firstName, lastName and age for the friend.'});
        } else if (age < 1 || age > 120) {
          res.status(400).json({errorMessage: 'Age must be a whole number between 1 and 120'})
        } else {
          res.status(200).json(updatedFriend);
        }
      })
      .catch(err => {
        res.status(500).json({error: 'The friend information could not be modified.'});
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
