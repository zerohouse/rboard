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
