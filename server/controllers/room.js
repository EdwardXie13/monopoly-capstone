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

// Creates new room.
router.post('/create', passport.isLoggedIn(), (req, res, next) => {
    const newRoom = new Room({
        roomId: req.body.roomId,
        players: [req.user]
    });

    newRoom.save(err => {
        if (err) return next(err);
        res.send({
            roomId: req.body.roomId,
            players: [req.user]
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

// Delete an existing room.
router.delete('/', (req, res, next) => {
    Room.deleteOne({ roomId: req.body.roomId }, (err, result) => {
        if (err) next(err);
        res.send(result);
    });
});

module.exports = router;