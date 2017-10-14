(function (app) {
    app.controller('applicationUserListController', applicationUserListController);

    applicationUserListController.$inject = ['$scope', 'apiService', 'notificationService', '$ngBootbox', '$filter', 'paramSettings', '$state'];

    function applicationUserListController($scope, apiService, notificationService, $ngBootbox, $filter, paramSettings, $state) {
        // Declare variables
        $scope.appUsers = [];
        $scope.page = 0;
        $scope.pageCount = 0;
        $scope.keyword = '';
        $scope.isAll = false;
        $scope.params = {
            sortOrder: 'DESC',
            sortField: 'FullName'
        }

        // Declare methods are called in views
        $scope.search = search;
        $scope.getAppUsers = getAppUsers;
        $scope.deleteItem = deleteItem;
        $scope.sortField = sortField;
        $scope.getClassSort = getClassSort;

        // Implement Methods
        function getAppUsers(page) {
            fn.loadingWindow();
            page = page || 0;
            var config = {
                params: {
                    keyword: $scope.keyword,
                    page: page,
                    pageSize: paramSettings.pageSize,
                    sortOrder: $scope.params.sortOrder,
                    sortField: $scope.params.sortField
                }
            }
            apiService.get('api/applicationUser/getall',
                config,
                function (result) {
                    $scope.appUsers = result.data.Items;
                    $scope.page = result.data.TotalPages; // Tổng số trang
                    $scope.totalCount = result.data.TotalCount; // Tổng số record
                    fn.reset();
                },
                function (error) {
                    if (error.status === 401) {
                        fn.reset();
                        notificationService.displayError('Bạn không có quyền xem trang này. Vui lòng đăng nhập!');
                        $state.go('login');
                    } else {
                        fn.reset();
                        notificationService.displayError('Không tải được danh sách');
                    }

                });
        }
        function deleteItem(id) {
            $ngBootbox.confirm('Bạn có chắc muốn xóa?')
                .then(function () {
                    var config = {
                        params: {
                            id: id
                        }
                    }
                    apiService.del('/api/applicationUser/delete', config, function () {
                        notificationService.displaySuccess('Đã xóa thành công.');
                        search();
                    },
                    function () {
                        notificationService.displayError('Xóa không thành công.');
                    });
                });
        }
        function search() {
            getAppUsers();
        }

        function sortField(fieldName) {
            if (fieldName != null && !angular.isUndefined(fieldName)) {
                if (angular.lowercase($scope.params.sortField) === angular.lowercase(fieldName)) {
                    $scope.params.sortOrder = angular.lowercase($scope.params.sortOrder) === 'asc' ? 'DESC' : 'ASC';
                }
                $scope.params.sortField = fieldName;
                getAppGroups();
            }
        }

        function getClassSort(sortField) {
            var result = '';
            if (sortField != null && !angular.isUndefined(sortField)) {
                if (angular.lowercase($scope.params.sortField) === angular.lowercase(sortField)) {
                    result = angular.lowercase($scope.params.sortOrder);
                }
            }
            return result;
        }

        // Call function initial
        getAppUsers();
    }
})(angular.module('coin.application_users'));