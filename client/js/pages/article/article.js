app.controller('articleController', function ($stateParams, $req, $scope, $state, $user) {
    $scope.$on("$stateChangeSuccess", function updatePage() {
        $req('post.findOne', $stateParams.articleId, function (res) {
            $scope.article = res;
            $scope.article.date = new Date($scope.article.date);
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
    };

    $scope.writeReply = function () {
        if ($scope.reply == "" || $scope.reply == undefined)
            return;
        var reply = {};
        reply.articleId = $stateParams.articleId;
        reply.reply = $scope.reply;
        $req('reply.write', reply, function (res) {
            if (res.err) {
                alert(res.err);
                return;
            }
            res.date = new Date(res.date);
            $scope.replies.unshift(res);
            $scope.reply = "";
            $scope.$apply();
        });
    };

    $scope.likeToggle = function () {
        if ($scope.article.like.contains($user._id)) {
            $req('post.unlike', $scope.article._id, function () {
                $scope.article.like.splice($scope.article.like.indexOf($user._id), 1);
                $scope.$apply();
            });
            return;
        }
        $req('post.like', $scope.article._id, function () {
            $scope.article.like.push($user._id);
            $scope.$apply();
        });
    };

    $scope.$on("$stateChangeSuccess", function updatePage() {
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
        $req('reply.get', req, function (res) {
            if ($scope.replies == undefined)
                $scope.replies = [];
            if (res.length < req.limit) {
                $scope.noMore = true;
            }
            res.forEach(function (each) {
                each.date = new Date(each.date);
                $scope.replies.push(each);
            });
            req.page++;
            $scope.$apply();
        });
    };

    $scope.deleteReply = function (reply) {
        if (!confirm("삭제하시겠습니까?"))
            return;
        var req = {};
        req.replyId = reply._id;
        req.articleId = $scope.article._id;
        $req('reply.delete', req, function (res) {
            if (res.err) {
                alert(res.err);
                return;
            }
            $scope.replies.splice($scope.replies.indexOf(reply), 1);
            $scope.$apply();
        });
    }


    $scope.deleteArticle = function () {
        if (!confirm("삭제하시겠습니까?"))
            return;

        $req('post.delete', $scope.article._id, function (res) {
            if (res.err) {
                alert(res.err);
                return;
            }
            $state.go('board.list', {url: $stateParams.url});
        });
    }
});