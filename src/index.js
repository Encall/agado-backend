import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import indexRouter from './routes/index.js';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(passport.initialize());

app.use('/api', indexRouter);

// add a basic route
app.get('/', function (req, res) {
    res.json({ message: 'Express is up!' });
});

// start the app
app.listen(3000, function () {
    console.log('Express is running on port 3000');
});
