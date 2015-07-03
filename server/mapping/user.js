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