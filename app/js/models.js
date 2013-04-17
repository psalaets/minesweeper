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
        row.push(new Cell());
      }

      this.rows.push(row);
    }
  }

})();