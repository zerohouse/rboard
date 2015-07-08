app.controller('myPageController', function ($scope, Upload, $user, $req, $state) {
    $scope.user = $user;

    $scope.$watch(function () {
        return $user;
    }, function () {
        if ($user.photo == undefined)
            return;
        $scope.style = {'background-image': 'url(/client/img/uploads/' + $user.photo + ')'};
    }, true);

    $scope.$watch(function () {
        return $user.name;
    }, function () {
        if ($user.name == "" || $user.name === undefined)
            return;
        $req('user.updateName', $user.name, function () {
        });
    }, true);

    $scope.$watch('photo', function () {
        if (!$scope.photo)
            return;
        Upload.upload({
            url: '/photo/upload',
            file: $scope.photo
        }).progress(function (evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function (data, status, headers, config) {
            $user.photo = data;
            $scope.style = {'background-image': 'url(/client/img/uploads/' + data + ')'};
        });
    });

    $scope.$on("$stateChangeSuccess", function updatePage() {
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
    });

    $scope.getPosts = function () {
        var req = $scope.req;
        req.skip = req.limit * req.page;
        $req('user.favorite', req, function (res) {
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

});