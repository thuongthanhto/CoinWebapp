(function (app) {
    'use strict';

    app.controller('applicationRoleListController', applicationRoleListController);

    applicationRoleListController.$inject = ['$scope', 'apiService', 'notificationService', '$ngBootbox', '$filter', 'paramSettings', '$state'];

    function applicationRoleListController($scope, apiService, notificationService, $ngBootbox, $filter, paramSettings, $state) {
        // Declare variables
        $scope.appRoles = [];
        $scope.page = 0;
        $scope.pageCount = 0;
        $scope.keyword = '';
        $scope.isAll = false;
        $scope.params = {
            sortOrder: 'DESC',
            sortField: 'Name'
        }

        // Declare methods are called in views
        $scope.search = search;
        $scope.getAppRoles = getAppRoles;
        $scope.deleteItem = deleteItem;
        $scope.selectAll = selectAll;
        $scope.sortField = sortField;
        $scope.getClassSort = getClassSort;
        $scope.deleteMultiple = deleteMultiple;
        $scope.sortField = sortField;
        $scope.getClassSort = getClassSort;

        // Implement Methods
        function getAppRoles(page) {
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
            apiService.get('api/applicationRole/getall',
                config,
                function (result) {
                    if (result.data.TotalCount === 0) {
                        notificationService.displayWarning('Không có bản ghi nào được tìm thấy.');
                    }
                    $scope.appRoles = result.data.Items;
                    $scope.page = result.data.TotalPages; // Tổng số trang
                    $scope.totalCount = result.data.TotalCount; // Tổng số record
                    if ($scope.totalCount === 0) {
                        angular.element(document.getElementById('checkAll')).prop('checked', false);
                    }
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

        function deleteMultiple() {
            var listId = [];
            $.each($scope.selected, function (i, item) {
                listId.push(item.Id);
            });

            $ngBootbox.confirm('Bạn có chắc chắn muốn xóa?')
                .then(function () {
                    var config = {
                        params: {
                            checkedList: JSON.stringify(listId)
                        }
                    }
                    apiService.del('api/applicationRole/deletemulti', config, function (result) {
                        notificationService.displaySuccess('Xóa thành công ' + result.data + ' bản ghi.');
                        search();
                    }, function (error) {
                        notificationService.displayError('Xóa không thành công');
                    });
                });
        }

        function selectAll() {
            if ($scope.isAll === false) {
                angular.forEach($scope.appRoles, function (item) {
                    item.checked = true;
                });
                $scope.isAll = true;
            } else {
                angular.forEach($scope.appRoles, function (item) {
                    item.checked = false;
                });
                $scope.isAll = false;
            }
        }

        $scope.$watch("appRoles", function (n, o) {
            var checked = $filter("filter")(n, { checked: true });
            if (checked.length) {
                $scope.selected = checked;
                $('#btnDelete').removeAttr('disabled');
            } else {
                $('#btnDelete').attr('disabled', 'disabled');
            }
        }, true);

        function deleteItem(id) {
            $ngBootbox.confirm('Bạn có chắc muốn xóa?')
                .then(function () {
                    var config = {
                        params: {
                            id: id
                        }
                    }
                    apiService.del('/api/applicationRole/delete', config, function () {
                        notificationService.displaySuccess('Đã xóa thành công.');
                        search();
                    },
                    function () {
                        notificationService.displayError('Xóa không thành công.');
                    });
                });
        }

        function search() {
            getAppRoles();
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
        getAppRoles();
    }
})(angular.module('coin.application_roles'));