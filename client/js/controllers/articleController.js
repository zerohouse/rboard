app.controller('articleController', function ($stateParams, $req, $scope, $state) {
    $scope.$on("$stateChangeSuccess", function updatePage() {
        $req('post.findOne', $stateParams.articleId, function (res) {
            $scope.article = res;
            $scope.$apply();
        });
    });

    $scope.delete = function () {
        if (!confirm("삭제하시겠습니까?"))
            return;
        $req('post.delete', $stateParams.articleId, function (res) {
            if (res.err) {
                alert(res.err);
                return;
            }
            $state.go('board.list', {url: $stateParams.url});
        });
    }

    $scope.writeReply = function () {
        var reply = {};
        reply.articleId = $stateParams.articleId;
        reply.reply = $scope.reply;
        $req('reply.write', reply, function (res) {
            if (res.err) {
                alert(res.err);
                return;
            }
            $scope.replies.unshift(res);
            $scope.$apply();
        });
    };

    $scope.$on("$stateChangeSuccess", function updatePage() {

        console.log(1);
        var req = $scope.req = {};
        req.articleId = $stateParams.articleId;
        req.limit = 50;
        req.skip = 0;
        req.page = 0;
        $scope.noMore = false;
        $scope.getReplies();
    });

    $scope.getReplies = function () {
        var req = $scope.req;
        req.skip = req.limit * req.page;
        console.log(req);
        $req('reply.get', req, function (res) {
            if ($scope.replies == undefined)
                $scope.replies = [];
            if (res.length == 0) {
                $scope.noMore = true;
            }
            res.forEach(function (each) {
                $scope.replies.push(each);
            });
            req.page++;
            $scope.$apply();
        });
    };

    $scope.deleteReply = function (reply) {
        if (!confirm("삭제하시겠습니까?"))
            return;
        $req('reply.delete', reply._id, function (res) {
            if (res.err) {
                alert(res.err);
                return;
            }
            $scope.replies.splice($scope.replies.indexOf(reply), 1);
            $scope.$apply();
        });
    }
});