const router = require('express').Router();

const Save = require('../models/save');

// @Route POST /api/save/
router.post('/', (req, res, next) => {
    const { roomCode, gamers, chanceCards, communityCards, turnIdx, board } = req.body;

    Save.findOne({ roomCode }, (error, result) => {
       if (error) return res.status(500).send(error);
       
       if (result) {
        Save.updateOne({ roomCode }, { roomCode, gamers, chanceCards, communityCards, turnIdx, board }, (error, result) => {
            if (error) return res.status(500).send(error);
            res.json(result);
        })
       } else {   
        Save.create({ roomCode, gamers, chanceCards, communityCards, turnIdx, board }, (error, result) => {
            if (error) next(error);
            res.json(result);
        });
       }
    })

});

// @Route GET /api/save/{roomCode}
router.get('/:roomCode', (req, res, next) => {
    Save.findOne({ roomCode: req.params.roomCode }, (error, result) => {
        if (error) next(error);
        res.json(result);
    });
});

module.exports = router;