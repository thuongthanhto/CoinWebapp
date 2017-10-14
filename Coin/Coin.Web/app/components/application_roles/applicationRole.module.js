(function () {
    angular.module('coin.application_roles', ['coin.common']).config(configFunction);

    configFunction.$inject = ['$stateProvider', '$urlRouterProvider'];

    function configFunction($stateProvider, $urlRouterProvider) {
        $stateProvider.state('application_roles',
            {
                url: "/application_roles",
                templateUrl: "/app/components/application_roles/applicationRoleListView.html",
                parent: 'base',
                controller: "applicationRoleListController"
            })
            .state('add_application_role',
            {
                url: "/add_application_role",
                parent: 'base',
                templateUrl: "/app/components/application_roles/applicationRoleAddView.html",
                controller: "applicationRoleAddController"
            })
            .state('edit_application_role',
            {
                url: "/edit_application_role/:id",
                templateUrl: "/app/components/application_roles/applicationRoleEditView.html",
                controller: "applicationRoleEditController",
                parent: 'base'
            });
    }
})();
