'use strict';

describe('Cell', function(){
  beforeEach(module('ms.models'));

  it('should count adjacent mines from neighbors', inject(function(Cell) {
      var c = new Cell();

      var north = new Cell();
      north.mined = true;

      var south = new Cell();
      south.mined = true;

      var east = new Cell();

      c.addNeighbor('N', north);
      c.addNeighbor('S', south);
      c.addNeighbor('E', east);

      expect(c.countAdjacentMines()).toEqual(2);
  }));

  it('should provide access to neighbors as Array', inject(function(Cell) {
      var c = new Cell();

      var north = new Cell();
      var south = new Cell();
      var east = new Cell();

      c.addNeighbor('N', north);
      c.addNeighbor('S', south);
      c.addNeighbor('E', east);

      var neighbors = c.getNeighbors();
      expect(neighbors).toContain(north);
      expect(neighbors).toContain(south);
      expect(neighbors).toContain(east);
  }));

  describe('when unvisited and unmarked', function() {
    var cell;
    beforeEach(inject(function(Cell) {
      cell = new Cell();
    }));

    describe('#visit', function() {
      it('should mark cell as visited', function() {
        cell.visit();

        expect(cell.visited).toBe(true);
      });

      it('should fire visited event', function() {
        var visitedCell;

        cell.bind('visited', function(c) {
          visitedCell = c;
        });

        cell.visit();

        expect(visitedCell).toBe(cell);
      });
    });

    describe('#flag', function() {
      it('should flag cell', function() {
        cell.flag();

        expect(cell.isFlagged()).toBe(true);
      });

      it('should fire change:marker event', function() {
        var flaggedCell, oldMarker;

        cell.bind('change:marker', function(c, oldValue) {
          flaggedCell = c;
          oldMarker = oldValue;
        });

        cell.flag();

        expect(flaggedCell).toBe(cell);
        expect(oldMarker).toBe('none');
      });
    });

    describe('#bookmark', function() {
      it('should bookmark cell', function() {
        cell.bookmark();

        expect(cell.isBookmarked()).toBe(true);
      });

      it('should fire change:marker event', function() {
        var bookmarkedCell, oldMarker;

        cell.bind('change:marker', function(c, oldValue) {
          bookmarkedCell = c;
          oldMarker = oldValue;
        });

        cell.bookmark();

        expect(bookmarkedCell).toBe(cell);
        expect(oldMarker).toBe('none');
      });
    });

    describe('#cycleMarker', function() {
      it('should flag cell', function() {
        cell.cycleMarker();

        expect(cell.isFlagged()).toBe(true);
      });
    });
  }); // end of tests for 'unvisited and unmarked'

  describe('when already visited', function() {
    var cell;
    beforeEach(inject(function(Cell) {
      cell = new Cell();
      cell.visit();
    }));

    describe('#visit', function() {
      it('should not fire visited event', function() {
        var visitedCell;

        cell.bind('visited', function(c) {
          visitedCell = c;
        });

        cell.visit();

        expect(visitedCell).toBeUndefined();
      });
    });

    describe("#flag", function() {
      it('should not flag cell', function() {
        cell.flag();

        expect(cell.isFlagged()).toBe(false);
      });

      it('should not fire change:marker event', function() {
        var flaggedCell;

        cell.bind('change:marker', function(c, oldValue) {
          flaggedCell = c;
        });

        cell.flag();

        expect(flaggedCell).toBeUndefined();
      });
    });

    describe('#bookmark', function() {
      it('should not bookmark cell', function() {
        cell.bookmark();

        expect(cell.isBookmarked()).toBe(false);
      });

      it('should not fire change:marker event', function() {
        var bookmarkedCell;

        cell.bind('change:marker', function(c, oldValue) {
          bookmarkedCell = c;
        });

        cell.bookmark();

        expect(bookmarkedCell).toBeUndefined();
      });
    });

    describe('#cycleMarker', function() {
      it('should not flag or bookmark cell', function() {
        cell.cycleMarker();

        expect(cell.isFlagged()).toBe(false);
        expect(cell.isBookmarked()).toBe(false);
      });
    });
  }); // end of 'already visited' tests

  describe('when already flagged', function() {
    var cell;
    beforeEach(inject(function(Cell) {
      cell = new Cell();
      cell.flag();
    }));

    describe('#visit', function() {
      it('should not fire visited event', function() {
        var visitedCell;

        cell.bind('visited', function(c) {
          visitedCell = c;
        });

        cell.visit();

        expect(visitedCell).toBeUndefined();
      });

      it('should not visit cell', function() {
        cell.visit();

        expect(cell.visited).toBe(false);
      });
    });

    describe("#visit('force')", function() {
      it('should unflag cell', function() {
        var oldMarker;

        cell.bind('change:marker', function(c, oldValue) {
          oldMarker = oldValue;
        });

        cell.visit('force');

        expect(oldMarker).toBe('flag');
        expect(cell.isFlagged()).toBe(false);
      });

      it('should fire visited event', function() {
        var visitedCell;

        cell.bind('visited', function(c) {
          visitedCell = c;
        });

        cell.visit('force');

        expect(visitedCell).toBe(cell);
      });

      it('should visit cell', function() {
        cell.visit('force');

        expect(cell.visited).toBe(true);
      });
    });

    describe("#flag", function() {
      it("should not fire change:marker event", function() {
        var flaggedCell;

        cell.bind('change:marker', function(c, oldValue) {
          flaggedCell = c;
        });

        cell.flag();

        expect(flaggedCell).toBeUndefined();
      });
    });

    describe('#bookmark', function() {
      it('should bookmark cell', function() {
        cell.bookmark();

        expect(cell.isBookmarked()).toBe(true);
      });

      it('should fire change:marker event', function() {
        var bookmarkedCell, oldMarker;

        cell.bind('change:marker', function(c, oldValue) {
          bookmarkedCell = c;
          oldMarker = oldValue;
        });

        cell.bookmark();

        expect(bookmarkedCell).toBe(cell);
        expect(oldMarker).toBe('flag');
      });
    });

    describe('#clearMarker', function() {
      it('should unflag cell', function() {
        cell.clearMarker();

        expect(cell.isFlagged()).toBe(false);
      });

      it('should fire change:marker event', function() {
        var unflaggedCell, oldMarker;

        cell.bind('change:marker', function(c, oldValue) {
          unflaggedCell = c;
          oldMarker = oldValue;
        });

        cell.clearMarker();

        expect(unflaggedCell).toBe(cell);
        expect(oldMarker).toBe('flag');
      });
    });

    describe('#cycleMarker', function() {
      it('should bookmark cell', function() {
        cell.cycleMarker();

        expect(cell.isBookmarked()).toBe(true);
        expect(cell.isFlagged()).toBe(false);
      });

      it('should fire change:marker event', function() {
        var cycledCell, oldMarker;

        cell.bind('change:marker', function(c, oldValue) {
          cycledCell = c;
          oldMarker = oldValue;
        });

        cell.clearMarker();

        expect(cycledCell).toBe(cell);
        expect(oldMarker).toBe('flag');
      });
    });
  }); // end of 'already flagged' tests

  describe('when already bookmarked', function() {
    var cell;
    beforeEach(inject(function(Cell) {
      cell = new Cell();
      cell.bookmark();
    }));

    describe('#visit', function() {
      it('should not fire visited event', function() {
        var visitedCell;

        cell.bind('visited', function(c) {
          visitedCell = c;
        });

        cell.visit();

        expect(visitedCell).toBeUndefined();
      });

      it('should not visit cell', function() {
        cell.visit();

        expect(cell.visited).toBe(false);
      });
    });

    describe("#visit('force')", function() {
      it('should unbookmark cell', function() {
        var oldMarker;

        cell.bind('change:marker', function(c, oldValue) {
          oldMarker = oldValue;
        });

        cell.visit('force');

        expect(oldMarker).toBe('bookmark');
        expect(cell.isBookmarked()).toBe(false);
      });

      it('should fire visited event', function() {
        var visitedCell;

        cell.bind('visited', function(c) {
          visitedCell = c;
        });

        cell.visit('force');

        expect(visitedCell).toBe(cell);
      });

      it('should visit cell', function() {
        cell.visit('force');

        expect(cell.visited).toBe(true);
      });
    });

    describe("#bookmark", function() {
      it("should not fire change:marker event", function() {
        var bookmarkedCell;

        cell.bind('change:marker', function(c, oldValue) {
          bookmarkedCell = c;
        });

        cell.bookmark();

        expect(bookmarkedCell).toBeUndefined();
      });
    });

    describe('#flag', function() {
      it('should flag cell', function() {
        cell.flag();

        expect(cell.isFlagged()).toBe(true);
      });

      it('should fire change:marker event', function() {
        var flaggedCell, oldMarker;

        cell.bind('change:marker', function(c, oldValue) {
          flaggedCell = c;
          oldMarker = oldValue;
        });

        cell.flag();

        expect(flaggedCell).toBe(cell);
        expect(oldMarker).toBe('bookmark');
      });
    });

    describe('#clearMarker', function() {
      it('should unbookmark cell', function() {
        cell.clearMarker();

        expect(cell.isBookmarked()).toBe(false);
      });

      it('should fire change:marker event', function() {
        var unbookmarkedCell, oldMarker;

        cell.bind('change:marker', function(c, oldValue) {
          unbookmarkedCell = c;
          oldMarker = oldValue;
        });

        cell.clearMarker();

        expect(unbookmarkedCell).toBe(cell);
        expect(oldMarker).toBe('bookmark');
      });
    });

    describe('#cycleMarker', function() {
      it('should unmark cell', function() {
        cell.cycleMarker();

        expect(cell.isBookmarked()).toBe(false);
        expect(cell.isFlagged()).toBe(false);
      });

      it('should fire change:marker event', function() {
        var cycledCell, oldMarker;

        cell.bind('change:marker', function(c, oldValue) {
          cycledCell = c;
          oldMarker = oldValue;
        });

        cell.clearMarker();

        expect(cycledCell).toBe(cell);
        expect(oldMarker).toBe('bookmark');
      });
    });
  }); // end of 'already bookmarked' tests
});
