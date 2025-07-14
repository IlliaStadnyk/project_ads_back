const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});
mongoose.connect('mongodb://0.0.0.0:27017/adsDB');
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to the database');
});
db.on('error', (err) => console.log('Error ' + err));

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'xyz567',
    cookie: { secure: process.env.NODE_ENV === 'production' },
    store: MongoStore.create(mongoose.connection),
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static(path.join(__dirname, '/client/build')));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api', require('./routes/ads.routs'));
