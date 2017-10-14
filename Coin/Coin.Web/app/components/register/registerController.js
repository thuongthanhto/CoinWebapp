(function (app) {
    app.controller('registerController', ['$scope', '$injector', 'notificationService',
        function ($scope, registerService, $injector, notificationService) {

            $scope.registerData = {
                userName: "",
                password: ""
            };

            $scope.registerSubmit = function () {
                fn.loadingWindow();
                registerService.register($scope.registerData.userName, $scope.registerData.password).then(function (response) {
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