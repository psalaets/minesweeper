'use strict';

/* Controllers */

angular.module('ms.controllers', ['ms.models']).
  controller('SetupController', ['$scope', function($scope) {

  }]).
  controller('GameController', ['$scope', 'Game', function($scope, Game) {
    var g = Game.beginner();

    $scope.game = g;

    $scope.status = 'playing';

    g.bind('win', function() {
      $scope.status = 'win!';
    });

    g.bind('lose', function() {
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

        console.log('just cycled, cell marker is now: ' + cell.marker)
      }
    };
  }]);