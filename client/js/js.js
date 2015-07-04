/**
 * Created by dev on 2015-07-01.
 */

var app = angular.module('rboard', ['ui.router', 'ngAnimate']);


app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('register', {
            url: "/page/register",
            controller: 'registerController',
            templateUrl: "/client/html/register.html",
            title: "회원가입"
        })
        .state('board', {
            url: "/:url",
            controller: 'boardController',
            templateUrl: "/client/html/board.html"
        })
        .state('write', {
            url: "/:url/write",
            controller: 'writeController',
            templateUrl: "/client/html/write.html",
            title: "글쓰기"
        });
});

app.config(["$locationProvider", function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);
app.factory('$io', function () {
    var $io = io('http://localhost');
    return $io;
});

app.factory('$req', function ($io) {
    var $req = {};
    var callbacks = {};

    $io.on('$req', function (res) {
        callbacks[res.url](res.data);
    });

    $req = function (url, data, callback) {
        var req = {};
        req.url = url;
        req.data = data;
        $io.emit('$req', req);
        callbacks[url] = callback;
    };
    return $req;
});
app.service('$user', function () {

});
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
        var req = $scope.req = {};
        req.board = $stateParams.url;
        req.limit = 3;
        req.skip = 0;
        req.page = 0;
        $scope.noMore = false;
        $scope.getPosts();
    });

    $scope.getPosts = function () {
        var req = $scope.req;
        req.skip = req.limit * req.page;
        $req('post.get', req, function (res) {
            if ($scope.titles == undefined)
                $scope.titles = [];
            if (res.length == 0) {
                $scope.noMore = true;
            }
            res.forEach(function (each) {
                $scope.titles.push(each);
            });
            req.page++;
            $scope.$apply();
        });
    };


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

    $scope.rand = function () {
        $req('post.search', "", function (res) {
            console.log(rand(res));
            $state.go('board', {url: rand(res)});
        });

        function rand(arr) {
            var sum = 0;
            arr.forEach(function (e) {
                if (e.board == $stateParams.url)
                    return;
                sum += e.count;
            });
            var r = Math.random();
            var range = 0;
            var result;

            for (var i = 0; i < arr.length; i++) {
                if (arr[i].board == $stateParams.url)
                    continue;
                range += arr[i].count / sum;
                if (r < range)
                    return arr[i].board;
            }
        }
    }

});
app.controller('registerController', function ($scope, $req, $user) {

    $scope.user = $user;

    $scope.register = function () {
        $req('user.register', $scope.user, function (response) {
            console.log(response);
        });
    };

    $scope.login = function () {
        $req('user.login', $scope.user, function (res) {
            if (res.err) {
                alert(res.err);
                return;
            }
            $user.logged = true;
        });
    };


});

app.controller('root', function ($req, $scope, $state, $stateParams) {
    $scope.$watch(function () {
        return $state.current;
    }, function () {
        $scope.state = $state.current;
        $scope.stateParams = $stateParams;
    });

    $scope.states = $state.get();
});
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
app.factory('$regex', function () {
    var regex = function (name) {
        if (regex.regex[name] == undefined)
            return false;
        var regs = regex.regex[name];
        for (var i = 0; i < regs.length; i++) {
            if (!regs[i]())
                return false;
        }
        return true;
    };

    regex.regex = {};
    regex.register = function (name, fn) {
        if (regex.regex[name] == undefined)
            regex.regex[name] = [];
        regex.regex[name].push(fn);
    };

    return regex;
});


app.directive('regex', function ($compile, $regex) {
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, element, attrs) {
            var message = angular.element("<div class='message' ng-show='!matched'>" + attrs.message + '</div>');
            $compile(message)(scope);

            element[0].parentNode.insertBefore(message[0], element[0].nextSibling);
            var regex = new RegExp(attrs.regex);
            var parent = scope.$parent;
            var regexTest = function () {
                return regex.test(parent.$eval(attrs.ngModel));
            };
            $regex.register(attrs.check, regexTest);
            parent.$watch(attrs.ngModel, function () {
                if (parent.$eval(attrs.ngModel) == undefined || parent.$eval(attrs.ngModel) == "" || regexTest()) {
                    element.removeClass('waring');
                    scope.matched = true;
                    return;
                }
                element.addClass('waring');
                scope.matched = false;
            });
        }
    }
});
app.directive('textarea', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attributes) {
            var minHeight = element[0].offsetHeight,
                paddingLeft = element.css('paddingLeft'),
                paddingRight = element.css('paddingRight');

            var $shadow = angular.element('<div></div>').css({
                position: 'absolute',
                top: 0,
                opacity: 0,
                width: element[0].offsetWidth - parseInt(paddingLeft || 0) - parseInt(paddingRight || 0),
                lineHeight: '15px',
                resize: 'none'
            });


            angular.element(document.body).append($shadow);

            var update = function () {
                var times = function (string, number) {
                    for (var i = 0, r = ''; i < number; i++) {
                        r += string;
                    }
                    return r;
                };


                var val = element.val().replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/&/g, '&amp;')
                    .replace(/\n$/, '<br/>&nbsp;')
                    .replace(/\n/g, '<br/>')
                    .replace(/\s{2,}/g, function (space) {
                        return times('&nbsp;', space.length - 1) + ' '
                    });
                $shadow.html(val);
                element.css('height', Math.max($shadow[0].offsetHeight /* the "threshold" */, minHeight) + 'px');
            };

            element.bind('keyup keydown keypress change', update);
            update();
        }
    }
});