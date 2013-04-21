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
  controller('GameController', ['$scope', 'GameService', function($scope, GameService) {
    var game = GameService.getGame();

    $scope.game = game;
    $scope.status = 'playing';

    game.bind('win', function() {
      $scope.status = 'win!';
    });

    game.bind('lose', function() {
      $scope.status = 'lose';
    });

    $scope.visit = function(cell) {
      if(!cell.visited && !cell.isFlagged() && !cell.isBookmarked()) {
        cell.visit();
      }
    };

    $scope.cycleMarker = function(cell) {
      if(!cell.visited) {
        cell.cycleMarker();
      }
    };
  }]);