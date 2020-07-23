const express = require('express');
const app = express();
const logger = require('morgan');
const parser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/config');

/* Routes for API*/
const routes = {
    tasks: require('./modules/tasks/tasks'),
    user: require('./modules/user/user')
}

/* Function to get DB URI from config file
* URI can be either local or hoisted
*/
const getDbUri = () => {
    let url = 'mongodb';
    if (config.env.remoteDb) {
        url += '+srv://'
    } else {
        url += '://'
    }
    if (config.env.dbUserName && config.env.dbUserName.length > 0 && config.env.dbPassword && config.env.dbPassword.length > 0) {
        url += config.env.dbUserName + ':' + config.env.dbPassword
    }
    if (config.env.dbHost && config.env.dbHost.length > 0) {
        url += config.env.dbHost;
    } else {
        console.log("**Db URI***Host not specified**")
    }
    console.log("**Db URI**");
    console.log(url);
    return url;
}

const dbConn = mongoose.connect(getDbUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(result => {
    console.log("**DB init***Success**");
})
.catch(err => {
    console.log("**DB init***Failure**");
    console.log(err)
})

/* Logger Middleware*/
app.use(logger('dev'));

/* Body parser Middleware
    This will be applied to incoming API request
*/
app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());

/* Middleware to handle CORS error*/
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
        return res.status(200).json({});
    }
    next();
});

/* Different Routes which handles requests*/
app.use('/tasks', routes.tasks);
app.use('/user', routes.user);


/* Middleware to Return Error*/
app.use((req, res, next) => {
    const error = new Error("Method/ Resource Not found");
    error.status = 404;
    next(error);
})

/* Middleware to Handle Error thrown from this application by errors returned by middleware
    or
    from external source like db
*/
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            errorMsg: error.message || "Internal Server Error"
        }
    })
})

module.exports = app;
