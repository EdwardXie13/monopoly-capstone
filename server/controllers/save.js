const router = require('express').Router();

const Save = require('../models/save');

// @Route POST /api/save/
router.post('/', (req, res, next) => {
    const { roomCode, gamers, chanceCards, communityCards, turnIdx } = req.body;
    console.log(req.body);
    // if (!roomCode || !gamers || !cards || !turnIdx) 
    //     res.status(500).send('Request body missing stuff.');

    Save.create({ roomCode, gamers, chanceCards, communityCards, turnIdx }, (error, result) => {
        if (error) next(error);
        res.json(result);
    });
});

// @Route GET /api/save/{roomCode}
router.get('/:roomCode', (req, res, next) => {
    Save.findOne({ roomCode: req.params.roomCode }, (error, result) => {
        if (error) next(error);
        res.json(result);
    });
});

module.exports = router;