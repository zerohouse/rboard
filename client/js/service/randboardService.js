app.factory('$rand', function ($req, $state, $stateParams) {
    return function () {
        $req('post.search', "", function (res) {
            var url = rand(res);
            if (url == $stateParams.url || url == "" || url == undefined)
                url = ['냉장고', '메르스', '박근혜', '이관호', '연평해전', '치인트', '하이브', '수지', '비정상회담', '피카소'][parseInt(Math.random() * 10)];
            $state.go('board.list', {url: url});
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

            for (var i = 0; i < arr.length; i++) {
                if (arr[i].board == $stateParams.url)
                    continue;
                range += arr[i].count / sum;
                if (r < range)
                    return arr[i].board;
            }
        }
    };
});