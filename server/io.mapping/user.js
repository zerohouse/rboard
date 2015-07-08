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