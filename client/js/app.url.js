app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('index', {
            url: "/",
            templateUrl: "/client/html/index.html"
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