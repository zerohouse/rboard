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