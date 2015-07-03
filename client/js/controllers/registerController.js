app.controller('registerController', function ($scope, $req, $user) {

    $scope.user = $user;

    $scope.register = function () {
        $req('user.register', $scope.user, function (response) {
            console.log(response);
        });
    };

    $scope.login = function () {
        $req('user.login', $scope.user, function (res) {
            if (res.err) {
                alert(res.err);
                return;
            }
            $user.logged = true;
        });
    };


});
