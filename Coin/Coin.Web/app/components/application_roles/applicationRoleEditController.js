(function (app) {
    'use strict';

    app.controller('applicationRoleEditController', applicationRoleEditController);

    applicationRoleEditController.$inject = ['$scope', 'apiService', 'notificationService', '$location', '$stateParams', '$ngBootbox', '$state', '$filter'];

    function applicationRoleEditController($scope, apiService, notificationService, $location, $stateParams, $ngBootbox, $state, $filter) {
        // Declare variables use at view
        $scope.appRole = {};
        $scope.listName = [];
        $scope.hasValueInDb = false;
        $scope.leavePage = {
            needConfirmation: true
        };
        $scope.originalAppRole = $scope.appRole;

        // Declare methods are called in view
        $scope.cancel = cancel;
        $scope.updateApplicationRole = updateApplicationRole;

        // Implement Methods
        function updateApplicationRole() {
            apiService.put('/api/applicationRole/update', $scope.appRole,
                function (result) {
                    notificationService.displaySuccess($scope.appRole.Name + ' đã được cập nhật.');
                    $state.go('application_roles');
                }, function (error) {
                    notificationService.displayError('Cập nhật không thành công.');
                });
        }

        function loadAppRoleDetail() {
            apiService.get('/api/applicationRole/getbyid/' + $stateParams.id, null,
            function (result) {
                $scope.appRole = result.data;
                $scope.originalAppRole = $scope.appRole;
            },
            function (result) {
                notificationService.displayError(result.data);
            });
        }

        $scope.$on('$locationChangeStart', function (event, next, current) {
            if ($scope.leavePage.needConfirmation
            && $scope.isFormDirty()) {
                $ngBootbox.confirm('Bạn có thay đổi một số trường bạn bạn chắc chắn muốn rời khỏi?')
                    .then(function () {
                        window.location = next;
                        $scope.leavePage.needConfirmation = false;
                    },
                        function () {
                            //Confirm was cancelled, don't delete customer
                            console.log('Confirm was cancelled');
                        });
                event.preventDefault();
            }
        });

        $scope.$watch("appRole.Name", function () {
            if ($scope.listName.indexOf($scope.appRole.Name) !== -1) {
                $scope.hasValueInDb = true;
            } else {
                $scope.hasValueInDb = false;
            }

        });

        $scope.isFormDirty = function () {
            // as the close window may bind to another pages
            // if on other pages, just return false
            if ($state.current.name !== "edit_application_role") {
                return false;
            }

            if (($scope.appRole.Name !== $scope.originalAppRole.Name))
                return true;
            return false;
        }

        function cancel() {
            if ($scope.leavePage.needConfirmation && $scope.isFormDirty()) {
                $ngBootbox.confirm('Bạn có thay đổi một số trường bạn bạn chắc chắn muốn rời khỏi?')
                    .then(function () {
                        $state.go('application_roles');
                        $scope.leavePage.needConfirmation = false;
                    },
                        function () {
                            //Confirm was cancelled, don't delete customer
                            console.log('Confirm was cancelled');
                        });
                event.preventDefault();
            } else
                $state.go('application_roles');
        }

        loadAppRoleDetail();
    }
})(angular.module('coin.application_roles'));