(function (app) {
    'use strict';

    app.controller('applicationGroupEditController', applicationGroupEditController);

    applicationGroupEditController.$inject = ['$scope', 'apiService', 'notificationService', '$location', '$stateParams', '$ngBootbox', '$state', '$filter'];

    function applicationGroupEditController($scope, apiService, notificationService, $location, $stateParams, $ngBootbox, $state, $filter) {
        // Declare variables use at view
        $scope.appGroup = {
        }
        $scope.roles = [];
        $scope.listName = [];
        $scope.selectedRoles = [];
        $scope.hasValueInDb = false;
        $scope.leavePage = {
            needConfirmation: true
        };
        $scope.originalAppGroup = $scope.appGroup;
        

        // Declare methods are called in view
        $scope.cancel = cancel;
        $scope.updateApplicationGroup = updateApplicationGroup;

        // Implement Methods
        function updateApplicationGroup() {
            $scope.appGroup.Roles = [];
            $.each($scope.selected, function (i, item) {
                $scope.appGroup.Roles.push(item);
            });
            apiService.put('/api/applicationGroup/update', $scope.appGroup, 
                function (result) {
                    notificationService.displaySuccess($scope.appGroup.Name + ' đã được cập nhật.');
                    $state.go('application_groups');
                }, function (error) {
                    notificationService.displayError('Cập nhật không thành công.');
                });
        }
        function loadAppGroupDetail() {
            apiService.get('/api/applicationGroup/getbyid/' + $stateParams.id, null,
            function (result) {
                $scope.appGroup = result.data;
                $scope.originalAppGroup = $scope.appGroup;
                $.each($scope.appGroup.Roles, function (i, item) {
                    $scope.selectedRoles.push(item.Id);
                });
                $.each($scope.roles, function (i, item) {
                    if ($scope.selectedRoles.indexOf(item.Id) !== -1) {
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }
                });
            },
            function (result) {
                notificationService.displayError(result.data);
            });
        }

        function loadRoles() {
            apiService.get('/api/applicationRole/getall',
                null,
                function (response) {
                    $scope.roles = response.data;
                }, function (response) {
                    notificationService.displayError('Không tải được danh sách quyền.');
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

        $scope.$watch("roles", function (n, o) {
            var checked = $filter("filter")(n, { selected: true });
            if (checked.length) {
                $scope.selected = checked;
            }
        }, true);

        $scope.$watch("appGroup.Name", function () {
            if ($scope.listName.indexOf($scope.appGroup.Name) !== -1) {
                $scope.hasValueInDb = true;
            } else {
                $scope.hasValueInDb = false;
            }

        });

        $scope.isFormDirty = function () {
            // as the close window may bind to another pages
            // if on other pages, just return false
            if ($state.current.name !== "edit_application_group") {
                return false;
            }

            if (($scope.appGroup.Name !== $scope.originalAppGroup.Name))
                return true;
            return false;
        }
        function cancel() {
            if ($scope.leavePage.needConfirmation && $scope.isFormDirty()) {
                $ngBootbox.confirm('Bạn có thay đổi một số trường bạn bạn chắc chắn muốn rời khỏi?')
                    .then(function () {
                        $state.go('application_groups');
                        $scope.leavePage.needConfirmation = false;
                    },
                        function () {
                            //Confirm was cancelled, don't delete customer
                            console.log('Confirm was cancelled');
                        });
                event.preventDefault();
            } else
                $state.go('application_groups');
        }

        // Call function initial
        loadAppGroupDetail();
        loadRoles();
    }
})(angular.module('coin.application_groups'));