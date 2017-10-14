(function (app) {
    app.controller('fogotPasswordController', ['$scope', '$injector', 'notificationService',
        function ($scope, fogotPasswordService, $injector, notificationService) {

            $scope.fogotPasswordData = {
                userName: "",
                password: ""
            };

            $scope.fogotPasswordSubmit = function () {
                fn.loadingWindow();
                fogotPasswordService.fogotPassword($scope.fogotPasswordData.userName, $scope.fogotPasswordData.password).then(function (response) {
                    if (response != null && response.data.error != undefined) {
                        fn.reset();
                        notificationService.displayError(response.data.error_description);
                    }
                    else {
                        fn.reset();
                        var stateService = $injector.get('$state');
                        stateService.go('home');
                    }
                });
            }
        }]);
})(angular.module('coin'));