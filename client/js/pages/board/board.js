app.controller('boardController', function ($user, $scope, $req, $state, $stateParams, $rand) {

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


    $scope.selectResult = function (select) {
        $scope.select = select;
    };

    $scope.move = function () {
        $state.go('board.list', {url: $scope.select.board});
        $scope.keyword = "";
    };


    $scope.showResults = function () {
        $scope.visible = true;
    };

    document.body.addEventListener('click', function () {
        $scope.visible = false;
        $scope.$apply();
    });


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

    $scope.rand = function () {
        $rand();
        $scope.keyword = "";
    }

    $scope.likeToggle = function (val) {
        if (!$user.logged) {
            alert("로그인 해주세요");
            $state.go('login', {url: $stateParams.url});
            return;
        }

        if ($user.like.contains(val)) {
            $req('user.unlike', val, function () {
                $user.like.splice($user.like.indexOf(val), 1);
                $scope.$apply();
            });
            return;
        }
        $req('user.like', val, function () {
            $user.like.push(val);
            $scope.$apply();
        });
    }

    $scope.$on("$stateChangeSuccess", function updatePage() {
        $req('post.search', "", function (res) {
            $scope.hots = res;
            $scope.$apply();
        });
    });

});