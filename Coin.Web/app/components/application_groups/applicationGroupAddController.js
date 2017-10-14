(function(app) {
    app.controller('applicationGroupAddController', applicationGroupAddController);

    applicationGroupAddController.$inject = ['$scope', 'apiService', 'notificationService', '$filter', '$location', '$ngBootbox', '$state'];

    function applicationGroupAddController($scope, apiService, notificationService, $filter, $location, $ngBootbox, $state) {
        // Declare variables
        $scope.appGroup = {
            Id: 0,
            Name: '',
            Description: '',
            Roles: []
        }
        $scope.roles = [];
        $scope.listName = [];
        $scope.hasValueInDb = false;
        $scope.originalAppGroup = angular.copy($scope.appGroup);
        $scope.leavePage = {
            needConfirmation: true
        };

        // Declare methods are called in views
        $scope.addAppGroup = addApplicationGroup;
        $scope.cancel = cancel;

        // Implement Methods
        function cancel() {
            if ($scope.leavePage.needConfirmation
            && $scope.isFormDirty()) {
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

        function addApplicationGroup() {
            $scope.appGroup.Roles = [];
            $.each($scope.selected, function (i, item) {
                $scope.appGroup.Roles.push(item);
            });
            apiService.post('api/applicationGroup/create',
                $scope.appGroup,
                function (result) {
                    notificationService.displaySuccess($scope.appGroup.Name + ' đã được thêm mới.');
                    $state.go('application_groups');
                },
                function (error) {
                    $scope.errors = error.data;
                    notificationService.displayError('Thêm mới không thành công.');
                });
        }

        function loadNameAppGroup() {
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

        $scope.$watch("appGroup.Name", function () {
            if ($scope.listName.indexOf($scope.appGroup.Name) !== -1) {
                $scope.hasValueInDb = true;
            } else {
                $scope.hasValueInDb = false;
            }

        });

        $scope.$watch("roles", function (n, o) {
            var checked = $filter("filter")(n, { checked: true });
            if (checked.length) {
                $scope.selected = checked;
            }
        }, true);

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

        $scope.isFormDirty = function () {
            // as the close window may bind to another pages
            // if on other pages, just return false
            if ($state.current.name !== "add_application_group") {
                return false;
            }

            if (($scope.appGroup.Name !== $scope.originalAppGroup.Name))
                return true;
            return false;
        }

        // Call function initial
        loadNameAppGroup();
        loadRoles();
        
    }

})(angular.module('coin.application_groups'));