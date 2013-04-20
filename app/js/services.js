'use strict';

angular.module('ms.services', []).
  factory('GameHolder', function() {
    var currentGame;
    return {
      setGame: function(game) {
        currentGame = game;
      },
      getGame: function() {
        return currentGame;
      }
    };
  });