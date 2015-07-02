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