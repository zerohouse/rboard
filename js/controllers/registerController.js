app.controller('registerController', function ($scope, $req) {

    $scope.user = {};

    $scope.register = function () {
        $req('user.register', $scope.user, function (response) {
            console.log(response);
        });
    };

    $scope.login = function () {
        $req('user.login', $scope.user, function (response) {
            console.log(response);
        });
    };


});
