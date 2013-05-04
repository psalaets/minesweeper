'use strict';

describe('Game', function(){
  beforeEach(module('ms.models'));

  describe('newly created', function() {
    it('should have pending status', inject(function(Game) {
      var g = new Game(2, 2, 2);

      expect(g.status).toBe('pending');
    }));
  });

  describe('started', function() {
    it('should have playing status', inject(function(Game) {
      var g = new Game(2, 2, 2);

      g.start();

      expect(g.status).toBe('playing');
    }));
  });

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

    it('should change status to lose if cell is mined', inject(function(Game) {
      var g = new Game(2, 2, 2);
      g.grid.getCell(0, 0).visit();

      var mined = g.grid.find(function(cell) { return cell.mined; });

      mined.visit();

      expect(g.status).toBe('lose');
    }));

    it('should recursively visit all neighbor cells with no adjacent mines', inject(function(Game) {
      var g = new Game(3, 3, 1);
      // ugly hack so we control where mine is
      g.grid.clearMines();
      g.grid.getCell(1, 2).mined = true;

      g.grid.getCell(0, 0).visit();

      var center = g.grid.getCell(1, 1);

      expect(center.neighbors.NW.visited).toBe(true);
      expect(center.neighbors.N.visited).toBe(true);
      expect(center.neighbors.NE.visited).toBe(false);

      expect(center.neighbors.W.visited).toBe(true);
      expect(center.visited).toBe(true);
      expect(center.neighbors.E.visited).toBe(false);

      expect(center.neighbors.SW.visited).toBe(true);
      expect(center.neighbors.S.visited).toBe(true);
      expect(center.neighbors.SE.visited).toBe(false);
    }));
  });

  it('should fire win event once all unmined cells are visited', inject(function(Game) {
    var g = new Game(3, 3, 1);
    // ugly hack so we control where mine is
    g.grid.clearMines();
    g.grid.getCell(2, 2).mined = true;

    var winFired = false;

    g.bind('win', function() {
      winFired = true;
    });

    g.grid.getCell(0, 0).visit();
    g.grid.getCell(1, 0).visit();
    g.grid.getCell(2, 0).visit();
    g.grid.getCell(0, 1).visit();
    g.grid.getCell(0, 2).visit();

    expect(winFired).toBe(true);
  }));

  it('should change status to win once all unmined cells are visited', inject(function(Game) {
    var g = new Game(3, 3, 1);
    // ugly hack so we control where mine is
    g.grid.clearMines();
    g.grid.getCell(2, 2).mined = true;

    g.grid.getCell(0, 0).visit();
    g.grid.getCell(1, 0).visit();
    g.grid.getCell(2, 0).visit();
    g.grid.getCell(0, 1).visit();
    g.grid.getCell(0, 2).visit();

    expect(g.status).toBe('win');
  }));

  it('should track how many more flags are expected', inject(function(Game) {
    var g = new Game(3, 3, 3);

    g.grid.getCell(0, 0).flag();
    g.grid.getCell(1, 0).flag();

    expect(g.expectedFlags).toEqual(1);

    g.grid.getCell(0, 0).unflag();

    expect(g.expectedFlags).toEqual(2);
  }));
});
