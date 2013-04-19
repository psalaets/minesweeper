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

  describe('#cycleMarker', function() {
    describe('Cell is not flagged, not marked', function() {
      it('should flag cell', inject(function(Cell) {
        var c = new Cell();

        c.cycleMarker();

        expect(c.flagged).toBe(true);
      }));
    });

    describe('Cell is flagged', function() {
      it('should mark cell and unflag cell', inject(function(Cell) {
        var c = new Cell();
        c.flagged = true;

        c.cycleMarker();

        expect(c.marked).toBe(true);
        expect(c.flagged).toBe(false);
      }));
    });

    describe('Cell is marked', function() {
      it('should unmark cell', inject(function(Cell) {
        var c = new Cell();
        c.marked = true;

        c.cycleMarker();

        expect(c.marked).toBe(false);
      }));
    });
  });
});
