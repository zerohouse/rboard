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