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


});