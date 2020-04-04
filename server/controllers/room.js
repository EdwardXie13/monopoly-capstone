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
    // 1, Find room with roomID.
    // 2. Update room's players.
    Room.findOne({ roomId: req.body.roomId }, (err, foundRoom) => {
        if (err) next(err);

        Room.updateOne({ roomId: foundRoom.roomId, players: [...foundRoom.players, req.user] }, (err2, numberAffected, rawResponse) => {
            if (err2) next(err2);
            res.send({ roomId: foundRoom.roomId, players: [...foundRoom.players, req.user] });
        });
    });
});

// Leave current room.
router.put('/leave', (req, res, next) => {
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
            res.json({ ...foundRoom, ...update });
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