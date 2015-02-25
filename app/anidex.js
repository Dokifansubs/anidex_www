(function () {
  var app = angular.module('anidex', ['ui.bootstrap', 'nav', 'ui.router', 'login']);

  app.constant('address', 'http://localhost');
  
  /*
   * Intercept HTTP StatusCodes, firing correct event.
   */
  app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    return {
      responseError: function (response) {
        $rootScope.$broadcast({
          401: AUTH_EVENTS.notAuthenticated,
          403: AUTH_EVENTS.notAuthorized,
          419: AUTH_EVENTS.sessionTimeout,
          440: AUTH_EVENTS.sessionTimeout
        }[response.status], response);
        return $q.reject(response);
      }
    };
  });

  app.controller('ApplicationController', function ($scope, $rootScope, AUTH_EVENTS, USER_ROLES, AuthenticationServices) {
    $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthenticationServices.isAuthorized;
    $scope.isLoginPage = false;

    $scope.setCurrentUser = function (user) {
      $scope.currentUser = user;
    };
    
    /*
     * Login in user automatically in case a cookie is set.
     */
    AuthenticationServices.autoLogin().then(function (user) {
      if (user !== null) {
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);        
      }
      $scope.setCurrentUser(user);
    });
  });
  
  /*
   * Configure states (routes) for website.
   */
  app.config(function ($stateProvider, USER_ROLES) {
    $stateProvider.state('dashboard', {
      url: '/main',
      templateUrl: '/index.html',
      data: {
        authorizedRoles: [USER_ROLES.all]
      }
    });
    
    /*
     * TODO: Implement
    $stateProvider.state('upload', {
      url: '/upload',
      templateUrl: '/upload.html',
      data: {
        authorizedRoles: [USER_ROLES.editor, USER_ROLES.admin]
      }
    });
    */
  });
  
  /*
   * Run once on page initialisation.
   * (Can't take $scope as argument)
   */
  app.run(function ($rootScope, AUTH_EVENTS, AuthenticationServices) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
      var authorizedRoles = next.data.authorizedRoles;

      if (!AuthenticationServices.isAuthorized(authorizedRoles)) {
        event.preventDefault();

        if (AuthenticationServices.isAuthenticated()) {
          // User is not allowed.
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        } else {
          // User is not logged in.
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        }
      }
    });
  });

  app.config(function ($httpProvider) {
    $httpProvider.interceptors.push([
      '$injector', function ($injector) {
        return $injector.get('AuthInterceptor');
      }
    ]);
  });
})();