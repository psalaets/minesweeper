(function() {
  angular.module('ms.models', [])
    .constant('Cell', Cell)
    .constant('Grid', Grid);

  function Cell(row, column) {
    this.row = row;
    this.column = column;

    // Values: flag, bookmark, none
    this.marker = 'none';

    // Neighbors keyed by relative direction (N, NW, etc)
    // Not all cells have 8 neighbors (e.g. corner, edge cells)
    this.neighbors = {};

    // Has a mine
    this.mined = false;
    // Player has gone to this cell
    this.visited = false;
  }

  Cell.prototype = {
    visit: function() {
      this.visited = true;
      this.trigger('visited', this);
    },
    flag: function() {
      this.setMarker('flag');
    },
    unflag: function() {
      this.clearMarker();
    },
    isFlagged: function() {
      return this.marker === 'flag';
    },
    setMarker:function(marker) {
      var oldValue = this.marker;
      this.marker = marker;

      if(oldValue !== this.marker) {
        this.trigger('change:marker', this);
      }
    },
    clearMarker: function() {
      this.setMarker('none');
    },
    bookmark: function() {
      this.setMarker('bookmark');
    },
    unbookmark: function() {
      this.clearMarker();
    },
    isBookmarked: function() {
      return this.marker === 'bookmark';
    },
    cycleMarker: function() {
      if(this.isFlagged()) {
        this.unflag();
        this.bookmark();
      } else if(this.isBookmarked()) {
        this.unbookmark();
      } else {
        this.flag();
      }
    },
    addNeighbor: function(location, neighbor) {
      this.neighbors[location] = neighbor;
    },
    //count of adjacent cells with mines
    getAdjacentMines: function() {
      var count = 0;
      for(var loc in this.neighbors) {
        if(this.neighbors[loc].mined) {
          count++;
        }
      }
      return count;
    }
  };

  // Enable Cells to fire events
  asEvented.call(Cell.prototype);

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

    var grid = this;
    this.each(function(cell) {
      grid.assignNeighbors(cell);
    });
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
    assignNeighbors: function(cell) {
      // row/col offsets from cell by relative location
      var offsets = {
        NW: [-1, -1],
        N:  [-1, 0],
        NE: [-1, 1],
        W:  [0, -1],
        E:  [0, 1],
        SW: [1, -1],
        S:  [1, 0],
        SE: [1, 1]
      };

      for(var loc in offsets) {
        var offset = offsets[loc];
        var neighbor = this.getCell(cell.row + offset[0], cell.column + offset[1]);
        if(neighbor) {
          cell.addNeighbor(loc, neighbor);
        }
      }
    },
    getCell: function(row, col) {
      if(row >= this.height || row < 0) return undefined;
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