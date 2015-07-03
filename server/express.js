app.use(function (req, res, next) {
    res.charset = "utf-8";
    next();
});

app.use('/node_modules', express.static('node_modules'));
app.use('/client', express.static('client'));
app.use('/socket.io', express.static('node_modules/socket.io/node_modules/socket.io-client'));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/index.html'));
});

http.listen(80, function () {
    logger.info('listening on *:80');
});