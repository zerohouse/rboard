app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('register', {
            url: "/register",
            controller: 'registerController',
            templateUrl: "/html/register.html",
            title: "회원가입"
        })
});

app.config(["$locationProvider", function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);