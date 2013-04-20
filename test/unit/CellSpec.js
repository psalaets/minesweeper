'use strict';

describe('Cell', function(){
  beforeEach(module('ms.models'));

  describe('#visit', function() {
    it('should mark cell as visited', inject(function(Cell) {
      var c = new Cell();

      c.visit();

      expect(c.visited).toBe(true);
    }));

    it('should fire visited event', inject(function(Cell) {
      var c = new Cell();
      var visitedCell;

      c.bind('visited', function(cell) {
        visitedCell = cell;
      });

      c.visit();

      expect(visitedCell).toBe(c);
    }));
  });

  describe('#flag', function() {
    it('should flag cell', inject(function(Cell) {
      var c = new Cell();

      c.flag();

      expect(c.flagged).toBe(true);
    }));

    it('should fire change:flag event', inject(function(Cell) {
      var c = new Cell();
      var flaggedCell;

      c.bind('change:flag', function(cell) {
        flaggedCell = cell;
      });

      c.flag();

      expect(flaggedCell).toBe(c);
    }));

    it('should not fire change:flag event if already flagged', inject(function(Cell) {
      var c = new Cell();
      c.flag();
      var eventFired = false;

      c.bind('change:flag', function() {
        eventFired = true;
      });

      c.flag();

      expect(eventFired).toBe(false);
    }));
  });

  describe('#unflag', function() {
    it('should unflag cell', inject(function(Cell) {
      var c = new Cell();
      c.flag();

      c.unflag();

      expect(c.flagged).toBe(false);
    }));

    it('should fire change:flag event', inject(function(Cell) {
      var c = new Cell();
      c.flag();
      var unflaggedCell;

      c.bind('change:flag', function(cell) {
        unflaggedCell = cell;
      });

      c.unflag();

      expect(unflaggedCell).toBe(c);
    }));

    it('should not fire change:flag event if already not flagged', inject(function(Cell) {
      var c = new Cell();
      var eventFired = false;

      c.bind('change:flag', function() {
        eventFired = true;
      });

      c.unflag();

      expect(eventFired).toBe(false);
    }));
  });

  describe('#bookmark', function() {
    it('should bookmark cell', inject(function(Cell) {
      var c = new Cell();

      c.bookmark();

      expect(c.bookmarked).toBe(true);
    }));

    it('should fire change:bookmark event', inject(function(Cell) {
      var c = new Cell();
      var bookmarkedCell;

      c.bind('change:bookmark', function(cell) {
        bookmarkedCell = cell;
      });

      c.bookmark();

      expect(bookmarkedCell).toBe(c);
    }));

    it('should not fire change:bookmark event if already bookmarked', inject(function(Cell) {
      var c = new Cell();
      c.bookmark();
      var eventFired = false;

      c.bind('change:bookmark', function() {
        eventFired = true;
      });

      c.bookmark();

      expect(eventFired).toBe(false);
    }));
  });

  describe('#unbookmark', function() {
    it('should unbookmark cell', inject(function(Cell) {
      var c = new Cell();
      c.bookmark();

      c.unbookmark();

      expect(c.bookmarked).toBe(false);
    }));

    it('should fire change:bookmark event', inject(function(Cell) {
      var c = new Cell();
      c.bookmark();
      var unbookmarkedCell;

      c.bind('change:bookmark', function(cell) {
        unbookmarkedCell = cell;
      });

      c.unbookmark();

      expect(unbookmarkedCell).toBe(c);
    }));

    it('should not fire change:bookmark event if not already bookmarked', inject(function(Cell) {
      var c = new Cell();
      var eventFired = false;

      c.bind('change:bookmark', function() {
        eventFired = true;
      });

      c.unbookmark();

      expect(eventFired).toBe(false);
    }));
  });

  describe('#cyclebookMarker', function() {
    describe('Cell is not flagged, not bookmarked', function() {
      it('should flag cell', inject(function(Cell) {
        var c = new Cell();

        c.cycleMarker();

        expect(c.flagged).toBe(true);
      }));
    });

    describe('Cell is flagged', function() {
      it('should bookmark cell and unflag cell', inject(function(Cell) {
        var c = new Cell();
        c.flagged = true;

        c.cycleMarker();

        expect(c.bookmarked).toBe(true);
        expect(c.flagged).toBe(false);
      }));
    });

    describe('Cell is bookmarked', function() {
      it('should unbookmark cell', inject(function(Cell) {
        var c = new Cell();
        c.marked = true;

        c.cycleMarker();

        expect(c.bookmarked).toBe(false);
      }));
    });
  });
});
