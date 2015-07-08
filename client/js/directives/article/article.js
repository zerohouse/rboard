app.directive('article', function () {

    return {
        restrict: 'A',
        templateUrl: '/client/js/directives/article/article.html',
        link: function (scope, el, attrs) {

        },
        controller: function ($scope, $user, $req) {
            $scope.$watch('article', function () {
                if ($scope.article == undefined)
                    return;
                $scope.article.date = new Date($scope.article.date);
            });

            $scope.likeToggle = function () {
                if ($scope.article.like.contains($user._id)) {
                    $req('post.unlike', $scope.article._id, function () {
                        $scope.article.like.splice($scope.article.like.indexOf($user._id), 1);
                        $scope.$apply();
                    });
                    return;
                }
                $req('post.like', $scope.article._id, function () {
                    $scope.article.like.push($user._id);
                    $scope.$apply();
                });
            };

        }

    }
});