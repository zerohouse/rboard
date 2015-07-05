app.controller('boardController', function ($scope, $req, $state, $stateParams, $rand) {

    $scope.keyword = "";

    $scope.$watch('keyword', function () {
        if ($scope.keyword == undefined || $scope.keyword == "") {
            $scope.results = [];
            return;
        }

        $req('post.search', $scope.keyword, function (res) {
            if (!check()) {
                var now = {};
                now.count = 0;
                now.board = $scope.keyword;
                res.push(now)
            }
            $scope.results = res;
            $scope.select = res[0];
            $scope.$apply();
            function check() {
                for (var i = 0; i < res.length; i++) {
                    if (res[i].board == $scope.keyword)
                        return true;
                }
                return false;
            }
        });
    });


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


    $scope.selectResult = function (select) {
        $scope.select = select;
    };

    $scope.move = function () {
        $state.go('board', {url: $scope.select.board});
    };

    $scope.keyPress = function (e) {
        if ($scope.results.length == 0)
            return;
        var index = $scope.results.indexOf($scope.select);
        switch (e.keyCode) {
            case 38:
                index--;
                if (index < 0)
                    index = $scope.results.length - 1;
                $scope.select = $scope.results[index];
                break;
            case 40:
                index++;
                if (index > $scope.results.length - 1)
                    index = 0;
                $scope.select = $scope.results[index];
                break;
            case 13:
                $scope.move();
                break;
        }
    }

    $scope.rand = $rand;

});