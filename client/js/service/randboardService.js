app.factory('$rand', function ($req, $state, $stateParams) {
    var rand = function () {
        $req('post.search', "", function (res) {
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
    };
    return rand;
});