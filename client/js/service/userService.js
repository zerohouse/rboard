app.factory('$user', function ($io) {
    var user = {};
    $io.on('user', function (res) {
        angular.copy(res, user);
        user.logged = true;
    });
    return user;

});

app.service('userList', function ($req, $rootScope, $user) {

    var list = {};

    list[$user._id] = $user;

    this.getList = function () {
        return list;
    };

    var fns = [];

    this.get = function (id, fn) {
        fns.push(fn);
        if (list[id] != undefined) {
            fn();
            return;
        }
        list[id] = true;
        $req('user', id, function (res) {
            list[id] = res.result;
            fns.forEach(function (fn) {
                fn();
            });
            $rootScope.$apply();
        });
    };
});