// ----------------------------------------------------------------------------------------------
//  External Dependencies
// ----------------------------------------------------------------------------------------------
const router = require('express').Router();

// ----------------------------------------------------------------------------------------------
//  Internal Dependencies
// ----------------------------------------------------------------------------------------------
const passport = require('../middlewares/authentication');
const Room = require('../models/room');

// ----------------------------------------------------------------------------------------------
//  Endpoints
// ----------------------------------------------------------------------------------------------

// Get all the existing rooms.
router.get('/', passport.isLoggedIn(), (req, res, err) => {
    Room.find({} , (err, foundRooms) => {
        if (err) next(err);

        res.json(foundRooms);
    });
});

// Creates new room.
router.post('/create', passport.isLoggedIn(), (req, res, next) => {
    const newRoom = new Room({
        name: req.body.roomName,
        roomId: req.body.roomId,
        players: [req.user],
        private: req.body.private,
        password: req.body.password
    });

    newRoom.save(err => {
        if (err) return next(err);
        res.send({
            name: req.body.roomName,
            roomId: req.body.roomId,
            players: [req.user],
            private: req.body.private
        });
    });
});

// Join an existing room.
router.put('/join', passport.isLoggedIn(), (req, res, next) => {
  const { roomName, password } = req.body;
  const query = { name: roomName };

  Room.findOne(query, (findErr, findRes) => {
    if (findErr) next(findErr);
    if (password != findRes.password) res.status(401).send('Wrong password.');

    const update = { players: [ ...findRes.players, req.user ] };

    Room.updateOne(query, update, (updateErr) => {
      if (updateErr) next(updateErr);
      res.json(update);
    });
  });
});

// Leave current room.
router.put('/leave', passport.isLoggedIn(), (req, res, next) => {
    Room.findOne({ name: req.body.roomName }, (err, foundRoom) => {
        if (err) next(err);

        const { roomName, playerName } = req.body;

        const filtered = foundRoom.players.filter(player => {
          return player.email != playerName;
        });
        const query = { name: roomName };
        const update = { players: filtered };

        if (update.players.length == 0) {
          // Delete the room.
          Room.deleteOne({ name: req.body.roomName }, (deleteErr, deleteRes) => {
            if (deleteErr) next(deleteErr);
            res.send({});
          });
        } else {
          Room.updateOne(query, update, (updateErr) => {
            if (updateErr) next(updateErr);
            res.json({ ...update });
          });
        }
    });
});

// Delete an existing room.
router.delete('/', (req, res, next) => {
    Room.deleteOne({ name: req.body.roomName }, (err, result) => {
        if (err) next(err);
        res.send(result);
    });
});

module.exports = router;
