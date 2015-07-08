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
