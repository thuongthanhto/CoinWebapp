(function (app) {
    app.controller('applicationUserAddController', applicationUserAddController);

    applicationUserAddController.$inject = ['$scope', 'apiService', 'notificationService', '$location', '$filter', '$ngBootbox', '$state'];

    function applicationUserAddController($scope, apiService, notificationService, $location, $filter, $ngBootbox, $state) {
        // Declare variables
        $scope.appUser = {
            Groups: []
        }
        $scope.originalAppUser = angular.copy($scope.appUser);
        $scope.leavePage = {
            needConfirmation: true
        };

        // Declare methods are called in views
        $scope.addAppUser = addAppUser;
        $scope.cancel = cancel;

        // Implement Methods
        function cancel() {
            if ($scope.leavePage.needConfirmation
            && $scope.isFormDirty()) {
                $ngBootbox.confirm('Bạn có thay đổi một số trường bạn bạn chắc chắn muốn rời khỏi?')
                    .then(function () {
                        $state.go('application_users');
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

        $scope.isFormDirty = function () {
            // as the close window may bind to another pages
            // if on other pages, just return false
            if ($state.current.name !== "add_application_role") {
                return false;
            }

            if (($scope.appUser.FullName !== $scope.originalAppUser.FullName))
                return true;
            return false;
        }

        function addAppUser() {
            apiService.post('/api/applicationUser/add',
                $scope.appUser,
                function (result) {
                    notificationService.displaySuccess($scope.appUser.FullName + ' đã được thêm mới.');
                    $state.go('application_users');
                },
                function (error) {
                    $scope.errors = error.data;
                    notificationService.displayError('Thêm mới không thành công.');
                });
        }

        function loadGroups() {
            apiService.get('/api/applicationGroup/getall',
                null,
                function (response) {
                    $scope.groups = response.data;
                }, function (response) {
                    notificationService.displayError('Không tải được danh sách nhóm.');
                });

        }

        // Call function initial
        loadGroups();
    }
})(angular.module('coin.application_users'));