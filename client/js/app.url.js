app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('board', {
            url: "/",
            controller: 'boardController',
            templateUrl: "/client/html/board.html"
        })
        .state('board.list', {
            url: ":url",
            controller: 'listController',
            templateUrl: "/client/html/board/list.html"
        })
        .state('register', {
            url: "/:url/register",
            controller: 'registerController',
            templateUrl: "/client/html/register.html",
            title: "회원가입"
        })
        .state('login', {
            url: "/:url/login",
            controller: 'loginController',
            templateUrl: "/client/html/login.html",
            title: "로그인"
        })
        .state('write', {
            url: "/:url/write",
            controller: 'writeController',
            templateUrl: "/client/html/write.html",
            title: "글쓰기"
        })
        .state('article', {
            url: "/:url/:articleId",
            controller: 'articleController',
            templateUrl: "/client/html/board/article.html"
        });
});

app.config(["$locationProvider", function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);