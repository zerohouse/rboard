app.post('/post/upload', function (req, res) {
    var files = [];
    req.files.file.forEach(function (file) {
        files.push(file.name);
    });
    res.send(files);
});
