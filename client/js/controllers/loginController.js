app.controller('loginController', function ($scope, $req, $user, $regex, $state, $stateParams, $rand) {

    $scope.user = $user;

    $scope.check = function () {
        if ($user.email == undefined)
            return false;
        if ($user.password == undefined)
            return false;
        if (!$regex('id'))
            return false;
        if (!$regex('user'))
            return false;
        if ($scope.notExistId)
            return false;
        return true;
    };


    $scope.login = function () {
        if (!$scope.check())
            return;
        $req('user.login', $scope.user, function (res) {
            if (res.err) {
                alert(res.err);
                return;
            }
            $user.logged = true;
            if ($stateParams.url == undefined) {
                $rand();
                return;
            }
            $state.go('board', {url: $stateParams.url})
        });
    };

    $scope.$watch(function () {
        return $scope.user.email;
    }, function () {
        $scope.notExistId = false;
        if (!$regex('id')) {
            return;
        }
        $req('user.existCheck', $scope.user.email, function (res) {
            $scope.notExistId = !res;
            $scope.$apply();
        });
    });
});
