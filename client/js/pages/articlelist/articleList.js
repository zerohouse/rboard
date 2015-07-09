app.directive('articleList', function () {

    return {
        restrict: "A",
        templateUrl: "/client/js/pages/articleList/articleList.html",
        scope: {
            articleList: '@'
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
                console.log($scope.articleList);
                $req($scope.articleList, req, function (res) {
                    if ($scope.articles == undefined)
                        $scope.articles = [];
                    if (res.length < req.limit) {
                        $scope.noMore = true;
                    }
                    res.forEach(function (each) {
                        $scope.articles.push(each);
                    });
                    req.page++;
                    console.log(res);
                    $scope.$apply();
                });
            };
            init();

        }
    }
});