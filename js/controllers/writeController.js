app.controller('writeController', function ($scope, $req) {

    $scope.article = {};

    $scope.write = function () {
        $req('post.write', $scope.article, function (res) {
            if (res.err) {
                alert(res.err);
                return;
            }
            alert('done');
        });
    }

});