var $mapping = function (url, fn) {
    $mapping[url] = fn;
};

io.on('connection', function (socket) {
    logger.debug(socket.session);
    if (socket.session.user != undefined)
        socket.emit('user', socket.session.user);
    socket.on('$req', function (req) {
        var promise = new Promise(function (ok) {
            $mapping[req.url](req.data, ok, socket);
        });
        promise.then(function (res) {
            var result = {};
            result.url = req.url;
            result.data = res;
            socket.emit('$req', result);
        });
    });
});

