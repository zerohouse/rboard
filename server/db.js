var db = {};

mongoDB.MongoClient.connect("mongodb://localhost:27017/rboard", function (err, connected) {
    if (!err) {
        logger.info("db connected");
    }
    db.user = connected.collection('user');
    db.post = connected.collection('post');
});