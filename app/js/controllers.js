'use strict';

angular.module('ms.controllers', ['ms.models', 'ms.services']).
  controller('SetupController', ['$scope', 'Game', 'GameHolder', '$location', function($scope, Game, gameHolder, $location) {
    ['beginner', 'intermediate', 'expert'].forEach(function(difficulty) {
      $scope[difficulty] = function() {
        gameHolder.setGame(Game[difficulty]());
        $location.path('/game');
      }
    });
  }]).
  controller('GameController', ['$scope', 'GameHolder', function($scope, gameHolder) {
    var game = gameHolder.getGame();

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