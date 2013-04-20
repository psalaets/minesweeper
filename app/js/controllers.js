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
      cell.visit();
    };
  }]);