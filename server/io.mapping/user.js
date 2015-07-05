$mapping('user.register', function (user, response, socket) {
    db.user.insertOne(user, function (err, result) {
        var res = {};
        res.err = err;
        res.result = result;
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