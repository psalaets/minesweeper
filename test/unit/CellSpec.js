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

      expect(c.isFlagged()).toBe(true);
    }));

    it('should fire change:marker event', inject(function(Cell) {
      var c = new Cell();
      var flaggedCell;

      c.bind('change:marker', function(cell) {
        flaggedCell = cell;
      });

      c.flag();

      expect(flaggedCell).toBe(c);
    }));

    it('should not fire change:marker event if already flagged', inject(function(Cell) {
      var c = new Cell();
      c.flag();
      var eventFired = false;

      c.bind('change:marker', function() {
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

      expect(c.isFlagged()).toBe(false);
    }));

    it('should fire change:marker event', inject(function(Cell) {
      var c = new Cell();
      c.flag();
      var unflaggedCell;

      c.bind('change:marker', function(cell) {
        unflaggedCell = cell;
      });

      c.unflag();

      expect(unflaggedCell).toBe(c);
    }));

    it('should not fire change:marker event if already not flagged', inject(function(Cell) {
      var c = new Cell();
      var eventFired = false;

      c.bind('change:marker', function() {
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

      expect(c.isBookmarked()).toBe(true);
    }));

    it('should fire change:marker event', inject(function(Cell) {
      var c = new Cell();
      var bookmarkedCell;

      c.bind('change:marker', function(cell) {
        bookmarkedCell = cell;
      });

      c.bookmark();

      expect(bookmarkedCell).toBe(c);
    }));

    it('should not fire change:marker event if already bookmarked', inject(function(Cell) {
      var c = new Cell();
      c.bookmark();
      var eventFired = false;

      c.bind('change:marker', function() {
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

      expect(c.isBookmarked()).toBe(false);
    }));

    it('should fire change:marker event', inject(function(Cell) {
      var c = new Cell();
      c.bookmark();
      var unbookmarkedCell;

      c.bind('change:marker', function(cell) {
        unbookmarkedCell = cell;
      });

      c.unbookmark();

      expect(unbookmarkedCell).toBe(c);
    }));

    it('should not fire change:marker event if not already bookmarked', inject(function(Cell) {
      var c = new Cell();
      var eventFired = false;

      c.bind('change:marker', function() {
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

        expect(c.isFlagged()).toBe(true);
      }));
    });

    describe('Cell is flagged', function() {
      it('should bookmark cell and unflag cell', inject(function(Cell) {
        var c = new Cell();
        c.flag();

        c.cycleMarker();

        expect(c.isBookmarked()).toBe(true);
        expect(c.isFlagged()).toBe(false);
      }));
    });

    describe('Cell is bookmarked', function() {
      it('should unbookmark cell', inject(function(Cell) {
        var c = new Cell();
        c.bookmark();

        c.cycleMarker();

        expect(c.isBookmarked()).toBe(false);
      }));
    });
  });
});
