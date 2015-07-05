app.controller('root', function ($req, $scope, $state, $stateParams, $user) {
    $scope.$watch(function () {
        return $state.current;
    }, function () {
        $scope.state = $state.current;
        $scope.stateParams = $stateParams;
    });

    $scope.logout = function () {
        $req('user.logout', {}, function () {
            $user.logged = false;
            $scope.$apply();
        });
    };

    $scope.user = $user;

    $scope.states = $state.get();
});