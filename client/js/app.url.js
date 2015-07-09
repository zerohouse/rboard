app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('board', {
            url: "/",
            controller: 'boardController',
            templateUrl: "/client/js/pages/board/board.html",
            title: "B.in",
            searchWindow: true,
        })
        .state('board.list', {
            url: ":url",
            controller: 'listController',
            templateUrl: "/client/js/pages/board/board/list.html",
            searchWindow: false
        })
        .state('article', {
            url: "/:url/post/:articleId",
            controller: 'articleController',
            templateUrl: "/client/js/pages/article/article.html"
        })
        .state('register', {
            url: "/register/:url",
            controller: 'registerController',
            templateUrl: "/client/js/pages/register/register.html",
            title: "회원가입"
        })
        .state('login', {
            url: "/login/:url",
            controller: 'loginController',
            templateUrl: "/client/js/pages/login/login.html",
            title: "로그인"
        })
        .state('myPage', {
            url: "/myPage/:url",
            controller: 'myPageController',
            templateUrl: "/client/js/pages/mypage/myPage.html",
            title: "마이페이지"
        })
        .state('write', {
            url: "/write/:url",
            controller: 'writeController',
            templateUrl: "/client/js/pages/write/write.html",
            title: "글쓰기"
        });

});

app.config(["$locationProvider", function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);