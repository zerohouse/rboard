app.controller('boardController', function ($scope, $req, $state, $stateParams) {

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
        var req = {};
        req.board = $stateParams.url;
        req.limit = 5;
        req.skip = 0;
        $req('post.get', req, function (res) {
            $scope.titles = res;
            console.log(res);
        });
    });


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

});