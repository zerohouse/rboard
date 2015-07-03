var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path'),
    mongoDB = require('mongodb'),
    session = require('express-session'),
    cookie = require('cookie'),
    cookieParser = require('cookie-parser'),
    winston = require('winston'),
    sessionStore = new session.MemoryStore();

var COOKIE_SECRET = 'secret';
var COOKIE_NAME = 'sid';

app.use(cookieParser(COOKIE_SECRET));
app.use(session({
    name: COOKIE_NAME,
    store: sessionStore,
    secret: COOKIE_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: null
    }
}));

io.use(function (socket, next) {
    try {
        var data = socket.handshake || socket.request;
        if (!data.headers.cookie) {
            return next(new Error('Missing cookie headers'));
        }
        var cookies = cookie.parse(data.headers.cookie);
        if (!cookies[COOKIE_NAME]) {
            return next(new Error('Missing cookie ' + COOKIE_NAME));
        }
        var sid = cookieParser.signedCookie(cookies[COOKIE_NAME], COOKIE_SECRET);
        if (!sid) {
            return next(new Error('Cookie signature is not valid'));
        }
        socket.sid = sid;
        sessionStore.get(sid, function (err, session) {
            if (err) return next(err);
            if (!session) return next(new Error('session not found'));
            socket.session = session;
            next();
        });
    } catch (err) {
        next(new Error('Internal server error'));
    }
});
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'debug'
        }),
        new (winston.transports.File)({
            filename: 'log/log.log'
        })
    ]
});
var db = {};

mongoDB.MongoClient.connect("mongodb://localhost:27017/rboard", function (err, connected) {
    if (!err) {
        logger.info("db connected");
    }
    db.user = connected.collection('user');
    db.post = connected.collection('post');
});
var $mapping = function (url, fn) {
    $mapping[url] = fn;
};

io.on('connection', function (socket) {
    logger.debug(socket.session);
    socket.on('$req', function (req) {
        var promise = new Promise(function (ok) {
            $mapping[req.url](req.data, ok, socket);
        });
        promise.then(function (res) {
            var result = {};
            result.url = req.url;
            result.data = res;
            socket.emit('$req', result);
        });
    });
});


$mapping('post.write', function (post, response) {
    db.post.insertOne(post, function (err, result) {
        var res = {};
        res.err = err;
        res.result = result;
        response(res);
    });
});
$mapping('user.register', function (user, response) {
    db.user.insertOne(user, function (err, result) {
        var res = {};
        res.err = err;
        res.result = result;
        response(res);
    });
});

$mapping('user.login', function (user, response, socket) {
    var find = {};
    find.email = user.email;
    db.user.findOne(find, function (err, result) {
        var res = {};
        if (result == null) {
            res.err = "가입하지 않은 이메일입니다.";
            response(res);
            return;
        }
        if (result.password != user.password) {
            res.err = "패스워드가 다릅니다.";
            response(res);
            return;
        }
        res.result = result;
        socket.session.user = result;
        sessionStore.set(socket.sid, socket.session);
        response(res);
    });
});
app.use(function (req, res, next) {
    res.charset = "utf-8";
    next();
});

app.use('/node_modules', express.static('node_modules'));
app.use('/client', express.static('client'));
app.use('/socket.io', express.static('node_modules/socket.io/node_modules/socket.io-client'));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/index.html'));
});

http.listen(80, function () {
    logger.info('listening on *:80');
});