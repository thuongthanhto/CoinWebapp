(function (app) {
    app.controller('rootController', rootController);

    rootController.$inject = ['$state', 'authData', 'loginService', '$scope', 'authenticationService'];

    function rootController($state, authData, loginService, $scope, authenticationService) {
        $scope.logOut = function () {
            loginService.logOut();
            $state.go('login');
        }
        var userInfor = JSON.parse(localStorage.getItem('userInfor'));
        if (userInfor != undefined) {
            $scope.authentication = userInfor.authenticationData;
        } else {
            $scope.authentication = authData.authenticationData;
        }
        
        $scope.sideBar = "/app/shared/views/sideBar.html";
    }
})(angular.module('coin'));