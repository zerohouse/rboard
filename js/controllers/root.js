app.controller('root', function ($req, $scope, $state) {
    $scope.$watch(function () {
        return $state.current;
    }, function () {
        $scope.state = $state.current;
    });

    $scope.states = $state.get();
});