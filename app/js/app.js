'use strict';

angular.module('ms', ['ms.models', 'ms.controllers', 'ms.filters', 'ms.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {
        redirectTo: '/setup'
      }).
      when('/setup', {
        controller: 'SetupController',
        templateUrl: 'setupTemplate'
      }).
      when('/game', {
        controller: 'GameController',
        templateUrl: 'gameTemplate'
      });
  }]);