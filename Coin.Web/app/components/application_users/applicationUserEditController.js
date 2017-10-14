(function (app) {

    app.controller('applicationUserEditController', applicationUserEditController);

    applicationUserEditController.$inject = ['$scope', 'apiService', 'notificationService', '$location', '$stateParams', '$ngBootbox', '$state', '$filter'];

    function applicationUserEditController($scope, apiService, notificationService, $location, $stateParams, $ngBootbox, $state, $filter) {
        // Declare variables use at view
        $scope.appUser = {};
        $scope.listUserName = [];
        $scope.hasValueInDb = false;
        $scope.leavePage = {
            needConfirmation: true
        };
        $scope.originalAppUser = $scope.appUser;

        // Declare methods are called in view
        $scope.cancel = cancel;
        $scope.updateAppUser = updateAppUser;

        // Implement Methods
        function updateAppUser() {
            apiService.put('/api/applicationUser/update',
                function (result) {
                    notificationService.displaySuccess($scope.appUser.FullName + ' đã được cập nhật.');
                    $state.go('application_users');
                }, function (error) {
                    notificationService.displayError('Cập nhật không thành công.');
                });
        }
        function loadDetail() {
            apiService.get('/api/applicationUser/detail/' + $stateParams.id, null,
            function (result) {
                $scope.appUser = result.data;
                $scope.originalAppUser = $scope.appUser;
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

        $scope.isFormDirty = function () {
            // as the close window may bind to another pages
            // if on other pages, just return false
            if ($state.current.name !== "edit_application_user") {
                return false;
            }

            if (($scope.appUser.UserName !== $scope.originalAppUser.UserName))
                return true;
            return false;
        }

        function cancel() {
            if ($scope.leavePage.needConfirmation && $scope.isFormDirty()) {
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
                $state.go('application_users');
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

        loadGroups();
        loadDetail();
    }
})(angular.module('coin.application_users'));