'use strict';

/* Filters */

angular.module('ms.filters', []).
  filter('adjacentMines', function() {
    return function(cell) {
      if(cell.visited) {
        return cell.countAdjacentMines() || null;
      }
    }
  });
