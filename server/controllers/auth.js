// ----------------------------------------------------------------------------------------------
//  External Dependencies
// ----------------------------------------------------------------------------------------------
const router = require('express').Router();

// ----------------------------------------------------------------------------------------------
//  Internal Dependencies
// ----------------------------------------------------------------------------------------------
const User = require('../models/user');
const passport = require('../middlewares/authentication');

// ----------------------------------------------------------------------------------------------
//  Endpoints
// ----------------------------------------------------------------------------------------------
router.post('/signup', (req, res, next) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return next(err);
        if (user) return res.status(422).send({ error: 'Email is in use!' });

        const newUser = new User({
            email: req.body.email,
            password: req.body.password
        });

        newUser.save(err => {
            if (err) return next(err);
            res.json({ success: true });
        });
    });
});

router.post('/signin', passport.authenticate('local'), (req, res) => {
    res.json(req.user);
});

router.post('/signout', (req, res) => {
    req.logout();
    res.status(200).json({ message: "Logout Successful!" });
});

router.put('/', passport.isLoggedIn(), (req, res, next) => {
  const query = { email: req.user.email };

  User.findOne(query, (err, findResult) => {
      if (err) next(err);

      const update = { ready: req.body.ready };

      User.updateOne(query, update, updateErr => {
        if (updateErr) next(updateErr);
        res.json(update);
      })
  })
})

module.exports = router;