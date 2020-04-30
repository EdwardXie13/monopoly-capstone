// ----------------------------------------------------------------------------------------------
//  External Dependencies
// ----------------------------------------------------------------------------------------------
const router = require('express').Router();

// ----------------------------------------------------------------------------------------------
//  Internal Dependencies
// ----------------------------------------------------------------------------------------------
const authController = require('./auth');
const roomController = require('./room');
const saveController = require('./save');

// ----------------------------------------------------------------------------------------------
//  Setup controllers
// ----------------------------------------------------------------------------------------------
router.use('/auth', authController);
router.use('/room', roomController);
router.use('/save', saveController);

module.exports = router;