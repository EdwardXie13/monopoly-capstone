// ----------------------------------------------------------------------------------------------
//  External Dependencies
// ----------------------------------------------------------------------------------------------
const app = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressSession = require('express-session');

// ----------------------------------------------------------------------------------------------
//  Internal Dependencies
// ----------------------------------------------------------------------------------------------
const controllers = require('./controllers');
const passport = require('./middlewares/authentication');

// ----------------------------------------------------------------------------------------------
//  Setup
// ----------------------------------------------------------------------------------------------
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true });
app.use(expressSession({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

app.use('/api', controllers);

const PORT = 8080;

app.listen(PORT, () => console.log('Server is listening to', PORT));