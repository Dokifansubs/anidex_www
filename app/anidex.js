(function () {
var app = angular.module('anidex', ['ui.bootstrap', 'ngCookies', 'ngResource']);
    app.config(function ($routeProvider, $locationProvider, $httpProvider) {
    var checkLoggedIn = function ($q, $timeout, $http, $location, $rootScope) {
    var deferred = $q.defer();
        $http.get('/authCheck').success(function (user) {
    if (user !== '0') {
    $timeout(deferred.resolve, 0);
    } else {
    $rootScope.message = 'You need to log in.';
        $timeout(function () {
        deferred.reject();
        }, 0);
        $location.url('/login');
    }
    });
        return deferred.promise;
    };
        $httpProvider.responseInterceptors.push(function ($q, $location) {
        return function (promise) {
        return promise.then(
            function (response) {
            return response;
            },
            function (response) {
            if (response.status === 401) {
            $location.url('/login');
            }
            return $q.reject(response);
            }
        );
        };
        });
    });
    
    app.factory('AuthenticationService', ['$http', '$cookieStore', '$rootScope', function ($http, $cookieStore, $rootScope) {
    var service = {};
        service.Login = function (username, password, done) {
        $http.post('/auth', {username: username, password: password})
            .success(function (data, status, headers, config) {
            done(data);
            })
            .error(function (data, status, headers, config) {
            console.log(status);
                done(data);
            });
        };
        service.SetCredentials = function (username, password) {
        $rootScope.globals = {
        currentUser: {
        username: username
        }
        };
            $cookieStore.put('globals', $rootScope.globals);
        };
        service.ClearCredentials = function () {
        $rootScope.globals = {};
            $cookieStore.remove('globals');
        };
        return service;
    }]);
    app.controller('ModalController', ['$scope', '$rootScope', 'AuthenticationService', '$modal', '$log', function ($scope, $rootScope, AuthenticationService, $modal, $log) {
    $scope.user = {
    user: 'name',
        password: null
    };
        $scope.open = function () {
        var modalInstance = $modal.open({
        templateUrl: '/components/login/loginModal.html',
            controller: 'ModalInstanceController',
            size: 'sm',
            backdrop: true,
            windowClass: 'modal',
            resolve: {
            user: function () {
            return $scope.user;
            }
            }
        });
            modalInstance.result.then(function () {

            }, function () {
            $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }]);
    app.controller('ModalInstanceController', ['$scope', 'AuthenticationService', '$log', '$modalInstance', function ($scope, AuthenticationService, $log, $modalInstance) {

    AuthenticationService.ClearCredentials();
        $scope.login = function () {
        $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function (response) {
            console.log(response);
                if (response.success) {
            $log.info('Authentication success.');
                AuthenticationService.SetCredentials($scope.username, $scope.password);
                $modalInstance.close('cancel');
            } else {
            $log.info('Authentication failure.');
                $scope.error = response.message;
            }
            $scope.dataLoading = false;
            });
        };
        $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        };
    }]);
    })();