app.controller('writeController', function ($scope, $req, $stateParams) {

    $scope.article = {};

    $scope.write = function () {
        $scope.article.board = $stateParams.url;
        $req('post.write', $scope.article, function (res) {
            if (res.err) {
                alert(res.err);
                return;
            }
            alert('done');
        });
    }

});