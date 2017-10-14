(function (app) {
    'use strict';
    app.service('authorizationService', ['$http', '$q',
        function ($http, $q) {
            return ({
                getToken: getToken,
                clearToken: clearToken,
                requestToken: requestToken,
                getUserInfo: getUserInfo,
                requestPermission: requestPermission,
                requestUserInfo: requestUserInfo,
                verifyCaptcha: verifyCaptcha,
                requestLogout: requestLogout,
                isLogged: isLogged,
                isAuthorized: isAuthorized,
                isRegisteredUser: isRegisteredUser,
                getLatestSpentTime: getLatestSpentTime,
                setLatestLogout: setLatestLogout,
                setLanguage: setLanguage,
                getLanguage: getLanguage,
                getRoles: getRoles,
                getLocalTimeZone: getLocalTimeZone,
                hasPermission: hasPermission
            });

            // ---
            // PUBLIC METHODS.
            // ---
            function setLanguage(language) {
                localStorage.setItem('language', language);
            }

            function getLanguage() {
                var language = localStorage.getItem('language');
                if (angular.isUndefined(language) || language == null) {
                    language = 'en';
                    localStorage.setItem('language', language);
                }

                return language;
            }


            function getLatestSpentTime() {
                var latestLogoutStorage = localStorage.getItem('latestLogout');
                var latestLoginStorage = localStorage.getItem('latestLogin');
                if (!angular.isUndefined(latestLogoutStorage) && latestLogoutStorage != null
                    && !angular.isUndefined(latestLoginStorage) && latestLoginStorage != null) {

                    var latestLogin = new Date(latestLoginStorage).getTime();
                    var latestLogout = new Date(latestLogoutStorage).getTime();
                    var hourDiff = latestLogout - latestLogin; //in ms
                    var minDiff = hourDiff / 60 / 1000; //in minutes

                    return Math.floor(minDiff);
                }

                return 0;
            }

            function setLatestLogout(date) {
                //var expiredTime = new Date();
                //expiredTime.setSeconds(expiredTime.getSeconds() + interval);
                if (date == null) {
                    localStorage.removeItem('latestLogout');
                } else {
                    localStorage.setItem('latestLogout', date);
                }
            }


            function isLogged() {
                //var expiredSessionTime = localStorage.getItem('expiredSession');

                var token = getToken();
                //return (!angular.isUndefined(token) && token != null)
                //&& (!angular.isUndefined(expiredSessionTime) && expiredSessionTime < new Date());

                var validToken = (!angular.isUndefined(token) && token != null);

                return validToken && !isExpiredSession();
            }

            function isExpiredSession() {
                var sessionTimeout = 600; // s
                var latestLogoutStorage = localStorage.getItem('latestLogout');
                if (!angular.isUndefined(latestLogoutStorage) && latestLogoutStorage != null) {
                    var latestLogout = new Date(latestLogoutStorage);
                    latestLogout.setSeconds(latestLogout.getSeconds() + sessionTimeout);
                    var currentDate = new Date();
                    return (currentDate > latestLogout);
                }

                return false;
            }

            function isRegisteredUser() {
                var userInfo = getUserInfo();
                return (userInfo != null && userInfo.userStatus == "0");
            }

            function getToken() {
                var token = JSON.parse(localStorage.getItem('token'));

                if (token != null) {
                    var currentTime = new Date();
                    var expiredTime = new Date(token.expired_time);

                    if (expiredTime > currentTime) {
                        return token.access_token;
                    }
                    else {
                        clearToken();
                    }
                }

                return null;
            }

            function getUserInfo() {
                var userinfo = JSON.parse(localStorage.getItem('userinfo'));
                return userinfo;
            }

            function hasPermission(permissionId) {
                var permissions = JSON.parse(localStorage.getItem('permissions'));

                var existedPermission = false;
                if (permissions != null) {
                    for (var i = 0; i < permissions.length; i++) {
                        if (permissions[i].id == permissionId) {
                            existedPermission = true;
                        }
                    }
                }


                return existedPermission;
            }

            function isAuthorized(routename) {
                if (routename === '/user-import') {
                    return hasPermission(8) && hasPermission(17) && hasPermission(18) && hasPermission(19);
                } else {
                    var routeId = 0;
                    switch (routename) {
                        case '/user':
                            routeId = 8;
                            break;
                        case '/client':
                            routeId = 1;
                            break;
                        case '/license':
                            routeId = 2;
                            break;
                        case '/client-rights':
                            routeId = 3;
                            break;
                        case '/rating-period':
                            routeId = 4;
                            break;
                        case '/rating-metric':
                            routeId = 5;
                            break;
                        case '/competence-model':
                            routeId = 6;
                            break;
                        case '/development-catalog':
                            routeId = 7;
                            break;
                        case '/user-rights':
                            routeId = 9;
                            break;
                        case '/suggest-raters':
                            routeId = 10;
                            break;
                        case '/analytics-client':
                            routeId = 11;
                            break;
                        case '/analytics-progress':
                            routeId = 12;
                            break;
                        case '/analytics-feedback':
                            routeId = 13;
                            break;
                        case '/analytics-recommendation':
                            routeId = 14;
                            break;
                        case '/export':
                            routeId = 15;
                            break;
                        default:
                            routeId = 8;
                            break;
                    }

                    return hasPermission(routeId);
                }
            }

            function clearToken() {
                localStorage.removeItem('token');
                localStorage.removeItem('permissions');
                localStorage.removeItem('userinfo');
                localStorage.removeItem('importedUsers');

                var headerBar = angular.element($(".headerBar-container")).scope();
                if (headerBar) {
                    delete headerBar.search.value;
                }

            }

            function verifyCaptcha(encodedResponse) {
                var request = $http({
                    method: 'POST',
                    url: 'api/Home/VerifyCaptcha?encodedResponse=' + encodedResponse,
                    contentType: 'application/json; charset=utf-8',
                    headers: {

                    }
                });

                return request.then(
                    function (response) {
                        return (response);
                    },
                    handleError);
            }

            function requestToken(username, password) {

                // update latest spent time
                var spentTime = getLatestSpentTime();
                var logoutTime = localStorage.getItem('latestLogout');
                var loginTime = localStorage.getItem('latestLogin');

                if (spentTime > 0 && !angular.isUndefined(logoutTime) && logoutTime != null) {
                    updateSpentTime(new Date(loginTime), new Date(logoutTime), spentTime, 0);
                }

                var request = $http({
                    method: 'OPTIONS',  // POST at Safari doesn't work
                    url: 'Token',
                    data: $.param({
                        grant_type: "password",
                        username: username,
                        password: password
                    }),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });

                return request.then(
                    function (response) {
                        var token = response.data;

                        var expiredTime = new Date();
                        expiredTime.setSeconds(expiredTime.getSeconds() + token.expires_in);

                        token.expired_time = expiredTime;

                        localStorage.setItem('token', JSON.stringify(token));

                        //// update latest spent time
                        //var spentTime = getLatestSpentTime();
                        //var loginTime = localStorage.getItem('latestLogin');
                        //var logoutTime = localStorage.getItem('latestLogout');
                        //if (spentTime > 0) {
                        //    updateSpentTime(loginTime, logoutTime, spentTime, 0);
                        //}

                        localStorage.setItem('latestLogin', new Date());
                        setLatestLogout(null);

                        return (response);
                    },
                    handleError);

            }

            function requestPermission() {
                var request = $http({
                    method: 'GET',
                    url: 'api/authorization/permissions',
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    }
                });

                return request.then(
                    function (response) {
                        var permissions = JSON.stringify(response.data);
                        localStorage.setItem('permissions', permissions);

                        return (response);
                    },
                    handleError);
            }

            function requestUserInfo() {
                var request = $http({
                    method: 'GET',
                    url: 'api/account/userinfo',
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    }
                });

                return request.then(
                    function (response) {
                        var userinfo = JSON.stringify(response.data[0]);
                        localStorage.setItem('userinfo', userinfo);

                        return (response);
                    },
                    handleError);
            }

            function requestLogout() {
                var request = $http({
                    method: 'GET',
                    url: 'api/account/Logout',
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    }
                });

                return request.then(function (response) {
                    setLatestLogout(new Date());

                    // update latest spent time
                    var spentTime = getLatestSpentTime();
                    var loginTime = new Date(localStorage.getItem('latestLogin'));
                    var logoutTime = new Date(localStorage.getItem('latestLogout'));
                    if (spentTime > 0) {
                        updateSpentTime(loginTime, logoutTime, spentTime, 0);
                    }

                    return (response);
                }, handleError);
            }

            function getRoles() {
                var request = $http({
                    method: 'GET',
                    url: 'api/authorization/Roles',
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    }
                });

                return request.then(
                    handleSuccess,
                    handleError);
            }

            function updateSpentTime(loginTime, logoutTime, spentTime, platform) {
                var data = {
                    LoginTime: loginTime,
                    LogoutTime: logoutTime,
                    SpentTime: spentTime,
                    Platform: platform
                };
                var request = $http({
                    method: 'POST',
                    url: 'api/TimeUsage',
                    contentType: 'application/json; charset=utf-8',
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    },
                    data: data
                });

                return request.then(handleSuccess, handleError);
            }

            function getLocalTimeZone() {
                return -(new Date().getTimezoneOffset()) / 60;
            }
            // ---
            // PRIVATE METHODS.
            // ---
            // handle error message
            function handleError(response) {
                if (
                    !angular.isObject(response.data)
                    ) {
                    return ($q.reject("An unknown error occurred."));
                }
                // Otherwise, use expected error message.
                return ($q.reject(response.data.error_description));
            }
            // handle success message
            function handleSuccess(response) {
                return (response.data);
            }
        }
    ]);
})(angular.module('coin.common'));

