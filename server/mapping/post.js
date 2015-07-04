$mapping('post.write', function (post, response) {
    db.post.insertOne(post, function (err, result) {
        var res = {};
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

