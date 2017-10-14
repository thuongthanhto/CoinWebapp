(function (app) {
    app.controller('applicationRoleAddController', applicationRoleAddController);

    applicationRoleAddController.$inject = ['$scope', 'apiService', 'notificationService', '$location', '$filter', '$ngBootbox', '$state'];

    function applicationRoleAddController($scope, apiService, notificationService, $filter, $location, $ngBootbox, $state) {
        // Declare variables
        $scope.appRole = {
            Id: '',
            Name: '',
            Description: ''
        }
        $scope.listName = [];
        $scope.hasValueInDb = false;
        $scope.originalAppRole = angular.copy($scope.appRole);
        $scope.leavePage = {
            needConfirmation: true
        };

        // Declare methods are called in views
        $scope.addAppRole = addAppRole;
        $scope.cancel = cancel;

        // Implement Methods
        function cancel() {
            if ($scope.leavePage.needConfirmation
            && $scope.isFormDirty()) {
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

        function addAppRole() {
            apiService.post('/api/applicationRole/add',
                $scope.appRole, 
                function (result) {
                    notificationService.displaySuccess($scope.appRole.Name + ' đã được thêm mới.');
                    $state.go('application_roles');
                },
                function (error) {
                    $scope.errors = error.data;
                    notificationService.displayError('Thêm mới không thành công.');
                });
        }

        function loadNameAppRole() {
            apiService.get('api/applicationGroup/getall',
                null,
                function (result) {
                    angular.forEach(result.data,
                    function (value) {
                        $scope.listName.push(value.Name);
                    });
                },
                function () {
                    console.log('Cannot get list Name');
                });
        }

        $scope.$watch("appRole.Name", function () {
            if ($scope.listName.indexOf($scope.appRole.Name) !== -1) {
                $scope.hasValueInDb = true;
            } else {
                $scope.hasValueInDb = false;
            }

        });

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

        $scope.isFormDirty = function () {
            // as the close window may bind to another pages
            // if on other pages, just return false
            if ($state.current.name !== "add_application_role") {
                return false;
            }

            if (($scope.appRole.Name !== $scope.originalAppRole.Name))
                return true;
            return false;
        }

        // Call function initial
        loadNameAppRole();
    }
})(angular.module('coin.application_roles'));