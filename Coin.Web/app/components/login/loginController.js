(function (app) {
    app.controller('loginController', ['$scope', 'loginService', '$injector', 'notificationService','vcRecaptchaService','authorizationService',
        function ($scope, loginService, $injector, notificationService, vcRecaptchaService, authorizationService) {

            // variable initial
            $scope.publicKey = '6Lcz8jIUAAAAAF6xlS-Ky8AIHN2Kph_SCa_7UuE5';
            $scope.response = null;
            $scope.widgetId = null;
            $scope.disableCaptcha = true;

            // Public method
            $scope.setResponse = function (response) {
                console.info('Response available');
                $scope.response = response;
                $scope.disableCaptcha = false;
            };
            $scope.setWidgetId = function (widgetId) {
                console.info('Created widget ID: %s', widgetId);
                $scope.widgetId = widgetId;
            };

            $scope.cbExpiration = function () {
                console.info('Captcha expired. Resetting response object');
                vcRecaptchaService.reload($scope.widgetId);
                $scope.response = null;
            };

            $scope.loginData = {
                userName: "",
                password: "",
                isRememberMe: false
            };

            $scope.loginSubmit = function () {
                fn.loadingWindow();
                authorizationService.verifyCaptcha($scope.response).then(
                    function (response) {
                        if (response.data === true) {
                            loginService.login($scope.loginData.userName, $scope.loginData.password).then(function (response) {
                                if (response != null && response.data.error != undefined) {
                                    fn.reset();
                                    vcRecaptchaService.reload($scope.widgetId);
                                    notificationService.displayError("Invalid username or password");
                                }
                                else {
                                    fn.reset();
                                    var stateService = $injector.get('$state');
                                    stateService.go('home');
                                }
                            });
                        } else {
                            vcRecaptchaService.reload($scope.widgetId);
                        }
                    },
                    function (errorMessage) {
                        vcRecaptchaService.reload($scope.widgetId);
                });
                
            }
        }]);
})(angular.module('coin'));