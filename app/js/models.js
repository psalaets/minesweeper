(function() {
  angular.module('ms.models', [])
    .constant('Cell', Cell)
    .constant('Grid', Grid);

  function Cell(row, column) {
    this.row = row;
    this.column = column;

    // Flagged as a mine
    this.flagged = false;
    // Marked as "come back later"
    this.marked = false;
    // Has a mine
    this.mined = false;
    // Player has gone to this cell
    this.visited = false;
    // How many mined cells touch this cell, can be 0-8 inclusive
    this.adjacentMines = 0;
  }

  function Grid(rowCount, columnCount) {
    this.rows = [];

    for(var i = 0; i < rowCount; i++) {
      // Build a row
      var row = [];

      for(var j = 0; j < columnCount; j++) {
        row.push(new Cell(i, j));
      }

      this.rows.push(row);
    }
  }

  Grid.prototype = {
    addMines: function(count) {

    },
    // Execute a function once for each cell
    each: function(fn) {
      for(var i = 0; i < this.rows.length; i++) {
        var row = this.rows[i];
        for(var j = 0; j < row.length; j++) {
          fn(this.rows[i][j]);
        }
      }
    },
    reduce: function(start, fn) {
      var result = start

      this.each(function(cell) {
        result = fn(result, cell);
      });

      return result;
    }
  };

})();