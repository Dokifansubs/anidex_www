'use strict';
(function () {
  var app = angular.module('nav', ['login']);

  app.directive('navBar', function () {
    return {
      restrict: 'E',
      templateUrl: '/components/shared/nav.html'
    };
  });

  app.controller('NavBarController', function ($scope, $rootScope, AUTH_EVENTS, AuthenticationServices) {
    $scope.login = function () {
      $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
    };

    $scope.logout = function () {
      AuthenticationServices.logout().then(function (res) {
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        $scope.setCurrentUser(null);
      }, function () {
      });
    };
  });
})();