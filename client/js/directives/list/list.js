app.directive('list', function () {

    return {
        restrict: "A",
        templateUrl: "/client/js/directives/list/list.html",
        scope: {
            list: '@'
        },
        controller: function ($state, $user, $req, $scope) {
            function init() {
                if (!$user.logged) {
                    $state.go('board');
                    return;
                }
                var req = $scope.req = {};
                req.limit = 3;
                req.skip = 0;
                req.page = 0;
                $scope.noMore = false;
                $scope.getPosts();
            }

            $scope.getPosts = function () {
                var req = $scope.req;
                req.skip = req.limit * req.page;
                $req($scope.list, req, function (res) {
                    if ($scope.articles == undefined)
                        $scope.articles = [];
                    if (res.length < req.limit) {
                        $scope.noMore = true;
                    }
                    res.forEach(function (each) {
                        $scope.articles.push(each);
                    });
                    req.page++;
                    $scope.$apply();
                });
            };
            init();

        }
    }
});