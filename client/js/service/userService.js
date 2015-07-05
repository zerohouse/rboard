app.factory('$user', function ($io) {

    var user = {};
    $io.on('user', function (res) {
        angular.copy(res, user);
        user.logged = true;
    });
    return user;

});