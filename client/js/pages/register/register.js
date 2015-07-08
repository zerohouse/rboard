app.controller('registerController', function ($scope, $req, $user, $regex, $state, $stateParams, $rand) {

    $scope.user = $user;

    $scope.register = function () {
        if (!$scope.check())
            return;
        $req('user.register', $scope.user, function (response) {
            if (response.err != null) {
                alert(response.err);
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

    $scope.check = function () {
        if ($user.email == undefined)
            return false;
        if ($user.password == undefined)
            return false;
        if ($user.name == undefined)
            return false;
        if (!$regex('id'))
            return false;
        if (!$regex('user'))
            return false;
        if ($scope.alreadyExistId)
            return false;
        return true;
    };


    $scope.$watch(function () {
        return $scope.user.email;
    }, function () {
        $scope.alreadyExistId = false;
        if (!$regex('id')) {
            return;
        }
        $req('user.existCheck', $scope.user.email, function (res) {
            $scope.alreadyExistId = res;
            $scope.$apply();
        });
    });
});
