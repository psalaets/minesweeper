'use strict';

angular.module('ms', ['ms.models', 'ms.controllers', 'ms.filters', 'ms.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/setup/:difficulty', {
        controller: 'SetupController',
        templateUrl: 'setupTemplate'
      }).
      when('/game', {
        controller: 'GameController',
        templateUrl: 'gameTemplate'
      }).
      otherwise({redirectTo: '/setup/'});
  }]);