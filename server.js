const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const userCtlr = require('./api/controllers/user');
const foodCtlr = require('./api/controllers/food');
const moodCtlr = require('./api/controllers/mood');
const medsCtlr = require('./api/controllers/meds');
const bowelCtlr = require('./api/controllers/bowel');
const imageCtlr = require('./api/controllers/image');
const authCtlr = require('./api/controllers/auth');

require("dotenv").config();

const port = process.env.PORT || 8080

app.use(express.json());

//session cookie
app.use(session({
  saveUninitialized: false,
  secret: 'keyboard cat',
  cookie: { maxAge: 60000 }
}))

app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204,
  "credentials": true,
  "allowCrossDomain": true
}))

app.use('/api/:version/', userCtlr)
app.use('/api/:version/food', foodCtlr)
app.use('/api/:version/mood', moodCtlr)
app.use('/api/:version/meds', medsCtlr)
app.use('/api/:version/bowel', bowelCtlr)
app.use('/api/:version/image', imageCtlr)
app.use('/api/:version/auth', authCtlr)


app.use(bodyParser.urlencoded({ extended: false }))


app.listen(port, () => (
    console.log(`Server started on port ${port}`)
))
