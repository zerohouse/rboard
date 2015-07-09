var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path'),
    session = require('express-session'),
    cookie = require('cookie'),
    cookieParser = require('cookie-parser'),
    winston = require('winston'),
    sessionStore = new session.MemoryStore(),
    multer = require('multer'),
    mongoDB = require('mongodb'),
    ObjectID = mongoDB.ObjectID;

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


app.use(multer({
    dest: './client/img/uploads/',
    rename: function (fieldname, filename) {
        return Date.now();
    },
    onFileUploadStart: function (file) {
    },
    onFileUploadComplete: function (file) {
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
    db.reply = connected.collection('reply');
});



var $mapping = function (url, fn) {
    $mapping[url] = fn;
};

io.on('connection', function (socket) {
    logger.debug(socket.session);
    if (socket.session.user != undefined)
        socket.emit('user', socket.session.user);
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


$mapping('post.write', function (post, response, socket) {
    var res = {};
    if (socket.session.user == undefined) {
        res.err = "login";
        response(res);
        return;
    }
    post.writer = socket.session.user._id;
    post.date = new Date();
    post.reply = 0;
    post.like = [];
    db.post.insertOne(post, function (err, result) {
        res.err = err;
        res.result = result;
        response(res);
    });
});

$mapping('post.search', function (keyword, response) {
    db.post.aggregate([
        {
            $match: {
                board: {
                    $regex: ".*" + keyword + ".*"
                }
            }
        },
        {
            $group: {
                _id: "$board",
                count: {$sum: 1}
            }
        },
        {
            $project: {
                _id: 0,
                board: "$_id",
                count: 1
            }
        },
        {$sort: {count: -1}},
        {$limit: 5}
    ], function (err, result) {
        response(result);
    });
});


$mapping('post.get', function (req, response) {
    db.post.find({"board": req.board}, {}, {
        skip: req.skip,
        limit: req.limit
    }).sort({_id: -1}).toArray(function (err, result) {
        response(result);
    });
});


$mapping('post.delete', function (articleId, response, socket) {
    var obj_id = new ObjectID(articleId);
    if (!socket.session.user) {
        response("로그인 해주세요.");
        return;
    }
    db.post.remove({_id: obj_id, writer: socket.session.user._id}, function (err, res) {
        if (res.result.ok == 1) {
            response(true);
            return;
        }
        var res = {};
        res.err = "잘못된 접근입니다.";
        response(res);
    });
});


$mapping('post.findOne', function (articleId, response) {
    var obj_id = new ObjectID(articleId);
    db.post.findOne({_id: obj_id}, function (err, res) {
        response(res);
    });
});


$mapping('post.like', function (articleId, response, socket) {
    var res = {};
    if (socket.session.user == undefined) {
        res.err = "login";
        response(res);
        return;
    }
    db.post.findOneAndUpdate({_id: new ObjectID(articleId)}, {$addToSet: {'like': socket.session.user._id}}, function () {
        response();
    });
});

$mapping('post.unlike', function (articleId, response, socket) {
    var res = {};
    if (socket.session.user == undefined) {
        res.err = "login";
        response(res);
        return;
    }
    db.post.findOneAndUpdate({_id: new ObjectID(articleId)}, {$pull: {'like': socket.session.user._id}}, function () {
        response();
    });
});
$mapping('reply.write', function (reply, response, socket) {
    var res = {};
    if (socket.session.user == undefined) {
        res.err = "login";
        response(res);
        return;
    }
    reply.writer = socket.session.user._id;
    reply.date = new Date();
    var id = new ObjectID(reply.articleId);
    db.post.findOneAndUpdate({_id: id}, {$inc: {reply: 1}}, function (err, result) {
    });
    db.reply.insertOne(reply, function (err, result) {
        res.err = err;
        res.result = result;
        response(reply);
    });
});


$mapping('reply.get', function (req, response) {
    db.reply.find({"articleId": req.articleId}, {}, {
        skip: req.skip,
        limit: req.limit
    }).sort({_id: -1}).toArray(function (err, result) {
        response(result);
    });
});


$mapping('reply.delete', function (req, response, socket) {
    var obj_id = new ObjectID(req.replyId);
    if (!socket.session.user) {
        response("로그인 해주세요.");
        return;
    }
    var id = new ObjectID(req.articleId);
    db.post.findOneAndUpdate({_id: id}, {$inc: {reply: -1}}, function () {
    });
    db.reply.remove({_id: obj_id, writer: socket.session.user._id}, function (err, res) {
        if (res.result.ok == 1) {
            response(true);
            return;
        }
        var res = {};
        res.err = "잘못된 접근입니다.";
        response(res);
    });
});


$mapping('user', function (id, response) {
    var key = new ObjectID(id);
    db.user.findOne({_id: key}, function (err, result) {
        var res = {};
        res.err = err;
        if (result != null)
            result.password = undefined;
        res.result = result;
        response(res);
    });
});


$mapping('user.updateName', function (name, response, socket) {
    var key = new ObjectID(socket.session.user._id);
    db.user.update({_id: key}, {$set: {name: name}},
        function (err, result) {
            socket.session.user.name = name;
            sessionStore.set(socket.sid, socket.session);
        });
});


$mapping('user.register', function (user, response, socket) {
    user.like = [];
    db.user.insertOne(user, function (err, result) {
        var res = {};
        res.err = err;
        res.result = result.ops[0];
        socket.session.user = user;
        sessionStore.set(socket.sid, socket.session);
        response(res);
    });
});


$mapping('user.existCheck', function (email, response) {
    db.user.findOne({email: email}, function (err, result) {
        if (result == null) {
            response(false);
            return;
        }
        response(true);
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
        socket.session.sid = socket.sid;
        socket.session.user = result;
        sessionStore.set(socket.sid, socket.session);
        response(res);
    });
});


$mapping('user.logout', function (user, response, socket) {
    socket.session.user = undefined;
    sessionStore.set(socket.sid, socket.session);
    response(true);
});


$mapping('user.like', function (articleId, response, socket) {
    var res = {};
    if (socket.session.user == undefined) {
        res.err = "login";
        response(res);
        return;
    }
    db.user.update({_id: new ObjectID(socket.session.user._id)}, {$addToSet: {'like': articleId}}, function (e, r) {
        socket.session.user.like.push(articleId);
        sessionStore.set(socket.sid, socket.session);
        response();
    });
});

$mapping('user.unlike', function (articleId, response, socket) {
    var res = {};
    if (socket.session.user == undefined) {
        res.err = "login";
        response(res);
        return;
    }

    db.user.update({_id: new ObjectID(socket.session.user._id)}, {$pull: {'like': articleId}}, function () {
        socket.session.user.like.splice(socket.session.user.like.indexOf(articleId), 1);
        sessionStore.set(socket.sid, socket.session);
        response();
    });
});


$mapping('user.favorite', function (req, response, socket) {
    db.post.find({"like": socket.session.user._id.toString()}, {}, {
        skip: req.skip,
        limit: req.limit
    }).sort({_id: -1}).toArray(function (err, result) {
        response(result);
    });
});

$mapping('user.my', function (req, response, socket) {
    db.post.find({"writer": socket.session.user._id.toString()}, {}, {
        skip: req.skip,
        limit: req.limit
    }).sort({_id: -1}).toArray(function (err, result) {
        response(result);
    });
});
app.post('/post/upload', function (req, res) {
    var files = [];
    if (req.files.file.forEach == undefined)
        files.push(req.files.file.name);
    else
        req.files.file.forEach(function (file) {
            files.push(file.name);
        });
    res.send(files);
});

app.post('/photo/upload', function (req, res) {
    if (req.session.user == undefined) {
        res.send("잘못된 접근");
        return;
    }
    var id = new ObjectID(req.session.user._id);
    db.user.findOneAndUpdate({_id: id}, {$set: {photo: req.files.file.name}}, function () {
        req.session.user.photo = req.files.file.name;
        sessionStore.set(req.session.sid, req.session);
        res.send(req.files.file.name);
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