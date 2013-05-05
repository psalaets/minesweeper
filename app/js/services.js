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
  }]).
  service('Timer', ['$timeout', function($timeout) {
    var self = this;

    self.secondsElapsed = 0;

    function tick() {
      self.secondsElapsed += 1;
      scheduleTick();
    }

    function scheduleTick() {
      self.promise = $timeout(tick, 1000);
    }

    this.start = function() {
      scheduleTick();
    };

    this.stop = function() {
      self.promise && $timeout.cancel(self.promise);
      delete self.promise;
    };

    this.reset = function() {
      self.stop();
      self.secondsElapsed = 0;
    };

    this.restart = function() {
      self.reset();
      self.start();
    };
  }]);