$mapping('reply.write', function (reply, response, socket) {
    var res = {};
    if (socket.session.user == undefined) {
        res.err = "login";
        response(res);
        return;
    }
    reply.writer = socket.session.user._id;
    reply.date = new Date();
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


$mapping('reply.delete', function (replyId, response, socket) {
    var obj_id = new ObjectID(replyId);
    if (!socket.session.user) {
        response("로그인 해주세요.");
        return;
    }
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

