(function (app) {
    app.factory('apiService', apiService);

    apiService.$inject = ['$http', 'authenticationService'];

    function apiService($http, authenticationService) {
        // Declare and return
        return {
            get: get,
            post: post,
            put: put,
            del: del
        };

        // Implement functions
        function get(url, params, success, failure) {
            authenticationService.setHeader();
            $http.get(url, params)
                .then(function (result) {
                    success(result);
                },
                    function (error) {
                        //console.log(error);
                        failure(error);
                    });
        }
        function post(url, data, success, failure) {
            authenticationService.setHeader();
            $http.post(url, data)
                .then(function (result) {
                    success(result);
                },
                    function (error) {
                        //console.log(error.status);
                        failure(error);
                    });
        }
        function put(url, data, success, failure) {
            authenticationService.setHeader();
            $http.put(url, data)
                .then(function (result) {
                    success(result);
                },
                    function (error) {
                        //console.log(error.status);
                        failure(error);
                    });
        }
        function del(url, data, success, failure) {
            authenticationService.setHeader();
            $http.delete(url, data)
                .then(function (result) {
                    success(result);
                },
                    function (error) {
                        //console.log(error.status);
                        failure(error);
                    });
        }
    }
})(angular.module('coin.common'));