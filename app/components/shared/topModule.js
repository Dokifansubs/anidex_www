'use strict';
(function(){
  var app = angular.module('top', ['login']);
  
  app.directive('topBar', function() {
    return {
      restrict: 'E',
      templateUrl: '/components/shared/top.html'
    };
  });
})();