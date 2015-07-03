$mapping('post.write', function (post, response) {
    db.post.insertOne(post, function (err, result) {
        var res = {};
        res.err = err;
        res.result = result;
        response(res);
    });
});

$mapping('post.search', function (post, response) {
    db.post.insertOne(post, function (err, result) {
        var res = {};
        res.err = err;
        res.result = result;
        response(res);
    });
});