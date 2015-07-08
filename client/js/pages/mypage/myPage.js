app.controller('myPageController', function ($scope, Upload, $user) {
    $scope.user = $user;

    $scope.$watch('photo', function () {
        if (!$scope.photo)
            return;
        Upload.upload({
            url: '/photo/upload',
            file: $scope.photo
        }).progress(function (evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function (data, status, headers, config) {
        });
    });
});