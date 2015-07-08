app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('board', {
            url: "/",
            controller: 'boardController',
            templateUrl: "/client/js/pages/board/board.html",
            title: "B.in",
            searchWindow: true
        })
        .state('board.list', {
            url: ":url",
            controller: 'listController',
            templateUrl: "/client/js/pages/board/board/list.html",
            searchWindow: false
        })
        .state('register', {
            url: "/:url/register",
            controller: 'registerController',
            templateUrl: "/client/js/pages/register/register.html",
            title: "회원가입"
        })
        .state('login', {
            url: "/:url/login",
            controller: 'loginController',
            templateUrl: "/client/js/pages/login/login.html",
            title: "로그인"
        })
        .state('myPage', {
            url: "/:url/myPage",
            controller: 'myPageController',
            templateUrl: "/client/js/pages/mypage/myPage.html",
            title: "마이페이지"
        })
        .state('write', {
            url: "/:url/write",
            controller: 'writeController',
            templateUrl: "/client/js/pages/write/write.html",
            title: "글쓰기"
        })
        .state('article', {
            url: "/:url/:articleId",
            controller: 'articleController',
            templateUrl: "/client/js/pages/article/article.html"
        });
});

app.config(["$locationProvider", function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);