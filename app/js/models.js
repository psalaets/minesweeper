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
    this.height = rowCount;
    this.width = columnCount;

    for(var i = 0; i < this.height; i++) {
      // Build a row
      var row = [];

      for(var j = 0; j < this.width; j++) {
        row.push(new Cell(i, j));
      }

      this.rows.push(row);
    }
  }

  Grid.prototype = {
    addMines: function(count, exclude) {
      var maxMines = (this.width * this.height) - 1;
      if(count > maxMines) {
        throw new Error("Cannot add " + count + " mines. There are only " + maxMines + " mine-able cells.");
      }

      function isMineable(cell) {
        return !cell.mined &&
          (cell.row !== exclude.row || cell.column !== exclude.column);
      }

      var minesLeft = count;
      while(minesLeft > 0) {
        var cell = this.randomCell();
        if(isMineable(cell)) {
          cell.mined = true;
          minesLeft--;
        }
      }
    },
    randomCell: function() {
      //yoink http://stackoverflow.com/a/1527820
      function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      var row = random(0, this.height - 1);
      var column = random(0, this.width - 1);
      return this.getCell(row, column);
    },
    getCell: function(row, col) {
      return this.rows[row][col];
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