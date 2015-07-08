app.directive('user', function () {
    return {
        restrict: 'A',
        scope: {
            user: '=',
            notName: '='
        },
        templateUrl: '/client/js/directives/user/user.html',
        controller: function ($scope, $req, userList) {
            $scope.$watch('user', function () {
                userList.get($scope.user, function () {
                    $scope.info = userList.getList()[$scope.user];
                    if (!$scope.info)
                        return;
                    if (!$scope.info.photo)
                        return;
                    $scope.style = {'background-image': 'url(/client/img/uploads/' + $scope.info.photo + ')'};
                });
            });

        }
    }
});