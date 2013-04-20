'use strict';

describe('Grid', function(){
  beforeEach(module('ms.models'));

  it('should create correct number of rows', inject(function(Grid) {
    var g = new Grid(3, 5);

    expect(g.rows.length).toEqual(3);
  }));

  it('should create rows with correct number of columns', inject(function(Grid) {
    var g = new Grid(3, 5);

    for(var i = 0; i < g.rows.length; i++) {
      expect(g.rows[i].length).toEqual(5);
    }
  }));

  it('should start cell numbering at top left', inject(function(Grid) {
    var g = new Grid(3, 5);

    var topLeftCell = g.getCell(0, 0);

    expect(topLeftCell.row).toEqual(0);
    expect(topLeftCell.column).toEqual(0);
  }));

  it('should end cell numbering at bottom right', inject(function(Grid) {
    var g = new Grid(3, 5);

    var botRightCell = g.getCell(2, 4);

    expect(botRightCell.row).toEqual(2);
    expect(botRightCell.column).toEqual(4);
  }));

  it("should assign neighbors to landlocked Cell", inject(function(Grid) {
    var g = new Grid(3, 3);
    var middle = g.getCell(1, 1);

    expect(middle.neighbors.NW).toBe(g.getCell(0, 0));
    expect(middle.neighbors.N).toBe(g.getCell(0, 1));
    expect(middle.neighbors.NE).toBe(g.getCell(0, 2));
    expect(middle.neighbors.W).toBe(g.getCell(1, 0));
    expect(middle.neighbors.E).toBe(g.getCell(1, 2));
    expect(middle.neighbors.SW).toBe(g.getCell(2, 0));
    expect(middle.neighbors.S).toBe(g.getCell(2, 1));
    expect(middle.neighbors.SE).toBe(g.getCell(2, 2));
  }));

  it("should assign neighbors to edge Cell", inject(function(Grid) {
    var g = new Grid(3, 3);
    var rightEdge = g.getCell(1, 2);

    expect(rightEdge.neighbors.NW).toBe(g.getCell(0, 1));
    expect(rightEdge.neighbors.N).toBe(g.getCell(0, 2));
    expect(rightEdge.neighbors.W).toBe(g.getCell(1, 1));
    expect(rightEdge.neighbors.SW).toBe(g.getCell(2, 1));
    expect(rightEdge.neighbors.S).toBe(g.getCell(2, 2));
  }));

  it("should assign neighbors to corner Cell", inject(function(Grid) {
    var g = new Grid(3, 3);
    var bottomRight = g.getCell(2, 2);

    expect(bottomRight.neighbors.NW).toBe(g.getCell(1, 1));
    expect(bottomRight.neighbors.N).toBe(g.getCell(1, 2));
    expect(bottomRight.neighbors.W).toBe(g.getCell(2, 1));
  }));

  it('should support #each', inject(function(Grid) {
    var g = new Grid(1, 2);
    var cells = [];

    g.each(function(cell) {
      cells.push(cell);
    });

    expect(cells.length).toEqual(2);
    expect(cells[0].row).toEqual(0);
    expect(cells[0].column).toEqual(0);
    expect(cells[1].row).toEqual(0);
    expect(cells[1].column).toEqual(1);
  }));

  it('should support #reduce', inject(function(Grid) {
    var g = new Grid(2, 3);
    var cells = [];

    var result = g.reduce(0, function(total, cell) {
      return total + 1;
    });

    expect(result).toEqual(6);
  }));

  describe('#getCell', function() {
    it('should return Cell at row and column', inject(function(Grid) {
      var g = new Grid(3, 5);

      var cell = g.getCell(1, 2);

      expect(cell.row).toEqual(1);
      expect(cell.column).toEqual(2);
    }));

    it('should return undefined when row is too high', inject(function(Grid) {
      var g = new Grid(3, 5);

      var cell = g.getCell(10, 2);

      expect(cell).toBeUndefined();
    }));

    it('should return undefined when column is too high', inject(function(Grid) {
      var g = new Grid(3, 5);

      var cell = g.getCell(1, 20);

      expect(cell).toBeUndefined();
    }));

    it('should return undefined when row is negative', inject(function(Grid) {
      var g = new Grid(3, 5);

      var cell = g.getCell(-1, 2);

      expect(cell).toBeUndefined();
    }));

    it('should return undefined when column is negative', inject(function(Grid) {
      var g = new Grid(3, 5);

      var cell = g.getCell(1, -2);

      expect(cell).toBeUndefined();
    }));
  });

  describe('#addMines', function() {
    it('should add mines to cells', inject(function(Grid) {
      var g = new Grid(3, 5);

      g.addMines(6);

      var mineCount = g.reduce(0, function(total, cell) {
        return total + (cell.mined ? 1 : 0);
      });

      expect(mineCount).toEqual(6);
    }));

    it('should not allow adding more mines than mineable cells', inject(function(Grid) {
      var g = new Grid(3, 5);

      expect(function() {
        g.addMines(16);
      }).toThrow();
    }));

    it('should allow a cell to be excluded', inject(function(Grid) {
      var g = new Grid(3, 3);

      g.addMines(8, {row: 1, column: 2});

      var excluded = g.getCell(1, 2);
      expect(excluded.mined).toEqual(false);
    }));

    it('should take excluded cell into account re: max mines', inject(function(Grid) {
      var g = new Grid(3, 3);

      expect(function() {
        g.addMines(9, {row: 1, column: 2});
      }).toThrow();
    }));
  });

  describe('#clearMines', function() {
    it('should removed mines from all cells', inject(function(Grid) {
      var g = new Grid(3, 5);
      g.addMines(6);

      g.clearMines();

      var mineCount = g.reduce(0, function(total, cell) {
        return total + (cell.mined ? 1 : 0);
      });

      expect(mineCount).toEqual(0);
    }));
  });

  describe('when Cell is visited', function() {
    it('should fire cellVisited event', inject(function(Grid) {
      var g = new Grid(2, 2);
      var visited;

      g.bind('cellVisited', function(cell) {
        visited = cell;
      });

      g.getCell(0, 0).visit();

      expect(visited).toBe(g.getCell(0, 0));
    }));
  });

  describe('when Cell is flagged', function() {
    it('should fire cellFlagged event', inject(function(Grid) {
      var g = new Grid(2, 2);
      var flagged;

      g.bind('cellFlagged', function(cell) {
        flagged = cell;
      });

      g.getCell(0, 0).flag();

      expect(flagged).toBe(g.getCell(0, 0));
    }));
  });

  describe('when Cell is unflagged', function() {
    it('should fire cellUnflagged event', inject(function(Grid) {
      var g = new Grid(2, 2);
      g.getCell(0, 0).flag();
      var unflagged;

      g.bind('cellUnflagged', function(cell) {
        unflagged = cell;
      });

      g.getCell(0, 0).unflag();

      expect(unflagged).toBe(g.getCell(0, 0));
    }));
  });

  describe('when Cell is bookmarked', function() {
    it('should fire cellBookmarked event', inject(function(Grid) {
      var g = new Grid(2, 2);
      var bookmarked;

      g.bind('cellBookmarked', function(cell) {
        bookmarked = cell;
      });

      g.getCell(0, 0).bookmark();

      expect(bookmarked).toBe(g.getCell(0, 0));
    }));
  });

  describe('when Cell is unbookmarked', function() {
    it('should fire cellUnbookmarked event', inject(function(Grid) {
      var g = new Grid(2, 2);
      g.getCell(0, 0).bookmark();
      var unbookmarked;

      g.bind('cellUnbookmarked', function(cell) {
        unbookmarked = cell;
      });

      g.getCell(0, 0).unbookmark();

      expect(unbookmarked).toBe(g.getCell(0, 0));
    }));
  });

  describe('when Cell has marker cycled', function() {
    it('should fire events in correct order', inject(function(Grid) {
      var g = new Grid(1, 1);
      var recordedEvents = [];

      var events = 'cellFlagged cellUnflagged cellBookmarked cellUnbookmarked';
      events.split(' ').forEach(function(event) {
        g.bind(event, function() {
          recordedEvents.push(event);
        });
      });

      var cell = g.getCell(0, 0);
      cell.cycleMarker();
      cell.cycleMarker();
      cell.cycleMarker();

      expect(recordedEvents).toEqual([
        'cellFlagged',
        'cellUnflagged',
        'cellBookmarked',
        'cellUnbookmarked'
      ]);
    }));
  });
});
