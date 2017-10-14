(function (app) {
    app.controller('homeController', homeController);

    homeController.$inject = ['$scope', '$state', 'apiService', 'notificationService', '$ngBootbox', '$filter', 'paramSettings', '$window', 'NgTableParams'];


    function homeController($scope, $state, apiService, notificationService, $ngBootbox, $filter, paramSettings, $window, NgTableParams, simpleList) {
       

        // Declare variables
        $scope.listByUsd = [];

        $scope.customConfigParams = createUsingFullOptions();

        function createUsingFullOptions() {
            var initialParams = {
                count: 20 // initial page size
            };
            var initialSettings = {
                // page size buttons (right set of buttons in demo)
                counts: [],
                // determines the pager buttons (left set of buttons in demo)
                paginationMaxBlocks: 13,
                paginationMinBlocks: 2,
                dataset: $scope.listByUsd
            };
            return new NgTableParams(initialParams, initialSettings);
        }


        // Declare methods are called in views
        $scope.pingHome = pingHome;
        $scope.getListByUsd = getListByUsd;

        // Implement Methods
        function pingHome() {
            fn.loadingWindow();
            apiService.get('/api/home/ping',
                null,
                function (result) {
                    fn.reset();
                },
                function (error) {
                    if (error.status === 401) {
                        fn.reset();
                        notificationService.displayError('Bạn không có quyền xem trang này. Vui lòng đăng nhập!');
                        $state.go('login');
                    } else {
                        fn.reset();
                        notificationService.displayError(error);
                    }

                });
        }

        function getListByUsd() {
            apiService.get('/api/home/getpricefirst',
                null,
                function (result) {
                    $scope.listByUsd = result.data;
                    localStorage.setItem("listByUsd", JSON.stringify($scope.listByUsd));
                    $scope.customConfigParams = createUsingFullOptions();
                },
                function (error) {
                    $scope.listByUsd = JSON.parse(localStorage.getItem("listByUsd"));
                    $scope.customConfigParams = createUsingFullOptions();
                });
        }
        
        $(function () {
            // Reference the auto-generated proxy for the hub.
            var chat = $.connection.chatHub;
            // Create a function that the hub can call back to display messages.
            chat.client.addNewMessageToPage = function (message) {
                if (message.length === 200) {
                    $scope.listByUsd = message;
                    localStorage.setItem("listByUsd", JSON.stringify($scope.listByUsd));
                    $scope.customConfigParams = createUsingFullOptions();
                    $scope.$apply();
                } else {
                    $scope.listByUsd = JSON.parse(localStorage.getItem("listByUsd"));
                    $scope.customConfigParams = createUsingFullOptions();
                    $scope.$apply();
                }
            };

            $.connection.hub.start().done(function () {
                $('#sendmessage').click(function () {
                    debugger;
                    // Call the Send method on the hub.
                    chat.server.send($('#displayname').val());
                    // Clear text box and reset focus for next comment.
                    $('#message').val('').focus();
                });
            });
        });

        // Call function initial
        getListByUsd();
        pingHome();
    }
})(angular.module('coin'));