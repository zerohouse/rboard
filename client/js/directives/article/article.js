app.directive('article', function () {

    return {
        restrict: 'A',
        templateUrl: '/client/js/directives/article/article.html',
        link: function (scope, el, attrs) {

        },
        controller: function ($scope) {
            $scope.article.date = new Date($scope.article.date);
        }

    }
});