app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('register', {
            url: "/page/register",
            controller: 'registerController',
            templateUrl: "/html/register.html",
            title: "회원가입"
        })
        .state('board', {
            url: "/:url",
            controller: 'boardController',
            templateUrl: "/html/board.html"
        })
        .state('write', {
            url: "/:url/write",
            controller: 'writeController',
            templateUrl: "/html/write.html",
            title: "글쓰기"
        });
});

app.config(["$locationProvider", function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);