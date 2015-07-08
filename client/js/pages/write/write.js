app.controller('writeController', function ($scope, $req, $stateParams, $state, Upload, $user) {

    $scope.article = {};

    $scope.$on("$stateChangeSuccess", function updatePage() {
        if (!$user.logged) {
            alert("로그인 해주세요");
            $state.go('login', {url: $stateParams.url});
            return;
        }
    });

    $scope.write = function () {
        if (!$user.logged) {
            alert("로그인 해주세요");
            $state.go('login', {url: $stateParams.url});
            return;
        }

        if ($scope.article.body == undefined || $scope.article.body == "")
            return;
        if ($scope.article.head == undefined || $scope.article.head == "")
            $scope.article.head = $scope.article.body.slice(0, 15) + "...";

        $scope.article.board = $stateParams.url;

        if ($scope.files && $scope.files.length != 0) {
            var promise = new Promise(function (ok, err) {
                Upload.upload({
                    url: '/post/upload',
                    file: $scope.files
                }).progress(function (evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                    ok(data);
                });
            });
            promise.then(function (data) {
                $scope.article.photos = data;
                write();
            });
            return;
        }

        write();
        function write() {
            $req('post.write', $scope.article, function (res) {
                if (res.err) {
                    alert(res.err);
                    return;
                }
                $state.go('board.list', {url: $stateParams.url});
            });
        }
    };


});