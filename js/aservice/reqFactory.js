app.factory('$req', function ($io) {
    var $req = {};
    var callbacks = {};

    $io.on('$req', function (res) {
        callbacks[res.url](res.data);
    });

    $req = function (url, data, callback) {
        var req = {};
        req.url = url;
        req.data = data;
        $io.emit('$req', req);
        callbacks[url] = callback;
    };
    return $req;
});