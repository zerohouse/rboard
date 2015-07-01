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