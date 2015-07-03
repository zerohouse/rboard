app.factory('$io', function () {
    var $io = io('http://localhost');
    return $io;
});
