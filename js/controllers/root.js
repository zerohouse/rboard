app.controller('root', function ($req, $scope, $state, $stateParams) {
    $scope.$watch(function () {
        return $state.current;
    }, function () {
        $scope.state = $state.current;
        $scope.stateParams = $stateParams;
    });

    $scope.states = $state.get();
});