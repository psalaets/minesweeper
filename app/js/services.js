'use strict';

angular.module('ms.services', ['ms.models']).
  factory('GameService', ['Game', function(Game) {
    var currentGame;
    return {
      getGame: function() {
        return currentGame;
      },
      beginner: function() {
        currentGame = Game.beginner();
      },
      intermediate: function() {
        currentGame = Game.intermediate();
      },
      expert: function() {
        currentGame = Game.expert();
      }
    };
  }]);