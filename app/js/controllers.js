'use strict';

angular.module('ms.controllers', ['ms.models', 'ms.services']).
  controller('SetupController', ['$scope', 'GameService', '$location', '$routeParams', function($scope, GameService, $location, $routeParams) {
    ['beginner', 'intermediate', 'expert'].forEach(function(difficulty) {
      $scope[difficulty] = function() {
        GameService[difficulty]();
        $location.path('/game');
      }
    });

    var requestedDifficulty = $routeParams.difficulty;
    if(requestedDifficulty) {
      $scope[requestedDifficulty]();
    }
  }]).
  controller('GameController', ['$scope', 'GameService', 'Timer', function($scope, GameService, Timer) {
    var game = GameService.getGame();

    $scope.timer = Timer;
    $scope.game = game;

    $scope.visit = function(cell) {
      cell.visit();
    };

    $scope.cycleMarker = function(cell) {
      cell.cycleMarker();
    };

    $scope.$watch("game.status", function(newValue, oldValue, scope) {
      if(newValue === 'win' || newValue === 'lose') {
        scope.timer.stop();
      }
    });

    game.start();
    $scope.timer.restart();
  }]);