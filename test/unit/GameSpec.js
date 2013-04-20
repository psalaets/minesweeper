'use strict';

describe('Game', function(){
  beforeEach(module('ms.models'));

  describe('on first cell visit', function() {
    it('should not fire lose event even if cell is mined', inject(function(Game) {
      var g = new Game(2, 2, 2);
      var mined = g.grid.find(function(cell) { return cell.mined; });

      var loseFired = false;
      g.bind('lose', function() {
        loseFired = true;
      });

      mined.visit();

      expect(loseFired).toBe(false);
    }));
  });

  describe('on cell visits after first', function() {
    it('should fire lose event if cell is mined', inject(function(Game) {
      var g = new Game(2, 2, 2);
      g.grid.getCell(0, 0).visit();

      var mined = g.grid.find(function(cell) { return cell.mined; });

      var loseFired = false;
      g.bind('lose', function() {
        loseFired = true;
      });

      mined.visit();

      expect(loseFired).toBe(true);
    }));

    it('should recursively visit all adjacent unmined cells', inject(function(Game) {
      var g = new Game(2, 2, 1);
      g.grid.getCell(0, 0).visit();

      var unmined = g.grid.findAll(function(cell) { return !cell.mined; });

      expect(unmined.length).toEqual(3);
      for(var i = 0; i < unmined.length; i++) {
        expect(unmined[i].visited).toBe(true);
      }
    }));
  });

  it('should fire win event once all unmined cells are visited', inject(function(Game) {
      var g = new Game(2, 2, 1);
      var winFired = false;

      g.bind('win', function() {
        winFired = true;
      });

      g.grid.getCell(0, 0).visit();

      expect(winFired).toBe(true);
  }));
});
