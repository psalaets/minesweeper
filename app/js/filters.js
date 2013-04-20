'use strict';

/* Filters */

angular.module('ms.filters', []).
  filter('visitedStatus', function() {
    return function(cell) {
      if(cell.mined) {
        return ":(";
      } else {
        return cell.countAdjacentMines() || null;
      }
    };
  }).
  filter('unvisitedStatus', function() {
    return function(cell) {
      if(cell.isFlagged()) {
        return "F";
      } else if(cell.isBookmarked()) {
        return "?";
      }
    };
  });
