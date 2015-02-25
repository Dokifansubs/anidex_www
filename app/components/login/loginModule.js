'use strict';
(function () {
  var app = angular.module('login', ['ui.bootstrap', 'ui.router']);

  app.factory('AuthenticationServices', function ($http, Session) {
    var authService = {};

    authService.login = function (credentials) {
      return $http.post('/login', credentials).then(function (res) {
        Session.create(res.data.id, res.data.id, "");
        return {'username': res.data.username};
      });
    };

    authService.isAuthenticated = function () {
      return !!Session.userId;
    };

    authService.isAuthorized = function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (authService.isAuthenticated() &&
          authorizedRoles.indexOf(Session.userRole) !== -1);
    };

    authService.autoLogin = function () {
      return $http.get('/authCheck').then(function (res) {
        if (res.data !== '0') {
          Session.create(res.data.id, res.data.id, "");
          return {'username': res.data.username};
        } else {
          return null;
        }
      });
    };

    authService.logout = function () {
      return $http.post('/logout').then(function (res) {
        return null;
      });
    };

    return authService;
  });

  app.directive('loginDialog', function (AUTH_EVENTS, $state) {
    return {
      restrict: 'A',
      template: '<div ng-if="visible" ng-include="\'/components/login/loginModal.html\'">',
      link: function (scope) {
        var showDialog = function () {
          scope.visible = true;
        };
        var hideDialog = function () {
          scope.visible = false;
        };
        scope.visible = false;
        scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
        scope.$on(AUTH_EVENTS.sessionTimeout, showDialog);
        scope.$on(AUTH_EVENTS.loginSuccess, hideDialog);

        scope.cancel = function () {
          hideDialog();
        };

        scope.register = function () {
          hideDialog();
          $state.go('register');
        };
      }
    };
  });

  app.controller('LoginController', function ($scope, $rootScope, AUTH_EVENTS, AuthenticationServices) {
    $scope.credentials = {
      username: '',
      password: '',
      rememberme: ''
    };

    $scope.login = function (credentials) {
      AuthenticationServices.login(credentials).then(function (user) {
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        $scope.setCurrentUser(user);
      }, function () {
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      });
    };
  });

  app.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  });

  app.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
  });

  app.service('Session', function () {
    this.create = function (sessionId, userId, userRole) {
      this.id = sessionId;
      this.userId = userId;
      this.userRole = [userRole];
    };

    this.destroy = function () {
      this.id = null;
      this.userId = null;
      this.userRole = null;
    };

    return this;
  });
})();