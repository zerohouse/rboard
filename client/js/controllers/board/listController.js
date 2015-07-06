app.controller('listController', function ($scope, $req, $stateParams) {


    $scope.$on("$stateChangeSuccess", function updatePage() {
        var req = $scope.req = {};
        req.board = $stateParams.url;
        req.limit = 3;
        req.skip = 0;
        req.page = 0;
        $scope.noMore = false;
        $scope.getPosts();
    });

    $scope.getPosts = function () {
        var req = $scope.req;
        req.skip = req.limit * req.page;
        $req('post.get', req, function (res) {
            if ($scope.articles == undefined)
                $scope.articles = [];
            if (res.length == 0) {
                $scope.noMore = true;
            }
            res.forEach(function (each) {
                $scope.articles.push(each);
            });
            req.page++;
            $scope.$apply();
        });
    };


});