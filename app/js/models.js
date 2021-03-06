(function() {
  angular.module('ms.models', [])
    .constant('Cell', Cell)
    .constant('Grid', Grid)
    .constant('Game', Game);

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
    visit: function(force) {
      if(force) this.clearMarker();
      if(this.visited || this.isFlagged() || this.isBookmarked()) return;

      this.visited = true;
      this.trigger('visited', this);
    },
    flag: function() {
      if(this.visited) return;

      this.setMarker('flag');
    },
    isFlagged: function() {
      return this.marker === 'flag';
    },
    setMarker:function(marker) {
      var oldValue = this.marker;
      this.marker = marker;

      if(oldValue !== this.marker) {
        this.trigger('change:marker', this, oldValue);
      }
    },
    clearMarker: function() {
      this.setMarker('none');
    },
    bookmark: function() {
      if(this.visited) return;

      this.setMarker('bookmark');
    },
    isBookmarked: function() {
      return this.marker === 'bookmark';
    },
    cycleMarker: function() {
      if(this.isFlagged()) {
        this.clearMarker();
        this.bookmark();
      } else if(this.isBookmarked()) {
        this.clearMarker();
      } else {
        this.flag();
      }
    },
    addNeighbor: function(location, neighbor) {
      this.neighbors[location] = neighbor;
    },
    //neighbors as Array
    getNeighbors: function() {
      var neighbors = [];
      for(var loc in this.neighbors) {
        neighbors.push(this.neighbors[loc]);
      }
      return neighbors;
    },
    //count of adjacent cells with mines
    countAdjacentMines: function() {
      return this.getNeighbors().reduce(function(total, neighbor) {
        return total + (neighbor.mined ? 1 : 0);
      }, 0);
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

      // Listen for visits to each Cell
      cell.bind('visited', function(cell) {
        grid.cellVisited(cell);
      });

      // Listen for marker changes on each Cell
      cell.bind('change:marker', function(cell, oldMarker) {
        grid.cellMarkerChanged(cell, oldMarker);
      });
    });
  }

  Grid.prototype = {
    cellVisited: function(cell) {
      this.trigger('cellVisited', cell);
    },
    cellMarkerChanged: function(cell, oldMarker) {
      if(cell.isFlagged()) {
        this.trigger('cellFlagged', cell);
      } else if(cell.isBookmarked()) {
        this.trigger('cellBookmarked', cell);
      } else {
        if(oldMarker === 'flag') {
          this.trigger('cellUnflagged', cell);
        } else if(oldMarker === 'bookmark') {
          this.trigger('cellUnbookmarked', cell);
        }
      }
    },
    size: function() {
      return this.width * this.height;
    },
    addMines: function(count, exclude) {
      var maxMines = this.width * this.height;
      if(exclude) maxMines -= 1;

      if(count > maxMines) {
        throw new Error("Cannot add " + count + " mines. There are only " + maxMines + " mine-able cells.");
      }

      // Make sure exclude is *something*
      exclude = exclude || {row: -1, column: -1};

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
    clearMines: function() {
      this.each(function(cell) {
        cell.mined = false;
      });
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
    },
    findAll: function(fn) {
      var found = [];

      this.each(function(cell) {
        if(fn(cell)) {
          found.push(cell);
        }
      });

      return found;
    },
    find: function(fn) {
      return this.findAll(fn)[0] || null;
    },
    getTotalMines: function() {
      return this.reduce(0, function(total, cell) {
        return total + (cell.mined ? 1 : 0);
      });
    }
  };

  // Enable Grids to fire events
  asEvented.call(Grid.prototype);

  function Game(rows, columns, mines) {
    this.grid = new Grid(rows, columns);
    this.grid.addMines(mines);

    this.expectedFlags = mines;

    this.visitsToWin = this.grid.size() - mines;
    this.visits = 0;

    // status can be: pending, playing, win, lose
    this.status = 'pending';

    var self = this;
    this.grid.bind('cellVisited', function(cell) {
      // If first visit is mined cell, move mines around so game can continue.
      if(!self.visits && cell.mined) {
        self.ensureNoMine(cell);
      }

      // Process like a normal visit
      self.cellVisited(cell);
    });

    this.grid.bind('cellFlagged', function() {
      self.expectedFlags--;
    });

    this.grid.bind('cellUnflagged', function() {
      self.expectedFlags++;
    });
  }

  Game.prototype = {
    start: function() {
      this.status = 'playing';
    },
    cellVisited: function(cell) {
      this.visits++;

      // Check for loss
      if(cell.mined) {
        this.lose();
      } else if(this.visits === this.visitsToWin) { // Check for win
        this.win();
      } else {
        this.cascadeVisits(cell);
      }
    },
    win: function() {
      this.status = 'win';
      this.trigger('win');
    },
    lose: function() {
      this.status = 'lose';
      this.trigger('lose');
    },
    // From http://www.techuser.net/minecascade.html
    cascadeVisits: function(cell) {
      if(!cell.countAdjacentMines()) {
        cell.getNeighbors().forEach(function(neighbor) {
          neighbor.visit('force');
        });
      }
    },
    ensureNoMine: function(cell) {
      var grid = this.grid;
      var mines = grid.getTotalMines();

      grid.clearMines();
      grid.addMines(mines, {
        row: cell.row,
        column: cell.column
      });
    }
  };

  asEvented.call(Game.prototype);

  Game.beginner = function() {
    return new Game(8, 8, 10);
  };

  Game.intermediate = function() {
    return new Game(16, 16, 40);
  };

  Game.expert = function() {
    return new Game(16, 30, 99);
  };
})();
