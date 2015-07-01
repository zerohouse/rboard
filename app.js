var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var db = {};
require('mongodb').MongoClient.connect("mongodb://localhost:27017/rboard", function (err, connected) {
    if (!err) {
        console.log("rboard connected");
    }
    db.user = connected.collection('user');
});


var $mapping = function (url, fn) {
    $mapping[url] = fn;
};

$mapping('user.register', function (user, response) {
    db.user.insertOne(user, function (err, result) {
        var res = {};
        res.err = err;
        res.result = result;
        response(res);
    });
});

$mapping('user.login', function (user, response) {
    db.user.findOne(user, function (err, result) {
        var res = {};
        res.err = err;
        res.result = result;
        response(res);
    });
});


io.on('connection', function (socket) {
    socket.on('$req', function (req) {
        var promise = new Promise(function (ok) {
            $mapping[req.url](req.data, ok);
        });
        promise.then(function (res) {
            var result = {};
            result.url = req.url;
            result.data = res;
            socket.emit('$req', result);
        });
    });
});


app.use(function (req, res, next) {
    res.charset = "utf-8";
    next();
});

app.use('/node_modules', express.static('node_modules'));

app.use('/js', express.static('js'));
app.use('/css', express.static('css'));
app.use('/html', express.static('html'));
app.use('/img', express.static('img'));

app.use('/socket.io', express.static('node_modules/socket.io/node_modules/socket.io-client'));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

http.listen(80, function () {
    console.log('listening on *:80');
});

