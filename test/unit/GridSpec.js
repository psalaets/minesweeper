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

    var topLeftCell = g.rows[0][0];

    expect(topLeftCell.row).toEqual(0);
    expect(topLeftCell.column).toEqual(0);
  }));

  it('should end cell numbering at bottom right', inject(function(Grid) {
    var g = new Grid(3, 5);

    var botRightCell = g.rows[2][4];

    expect(botRightCell.row).toEqual(2);
    expect(botRightCell.column).toEqual(4);
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

  it('should be able to get Cell by row and column', inject(function(Grid) {
    var g = new Grid(3, 5);

    var cell = g.getCell(1, 2);

    expect(cell.row).toEqual(1);
    expect(cell.column).toEqual(2);
  }));

  it('should return undefined when asked for Cell beyond row range', inject(function(Grid) {
    var g = new Grid(3, 5);

    var cell = g.getCell(10, 2);

    expect(cell).toBeUndefined();
  }));

  it('should return undefined when asked for Cell beyond column range', inject(function(Grid) {
    var g = new Grid(3, 5);

    var cell = g.getCell(1, 20);

    expect(cell).toBeUndefined();
  }));

  describe('#addMines', function() {
    it('should add mines to cells', inject(function(Grid) {
      var g = new Grid(3, 5);

      g.addMines(6, {row: 1, column: 2});

      var mineCount = g.reduce(0, function(total, cell) {
        return total + (cell.mined ? 1 : 0);
      });

      expect(mineCount).toEqual(6);
    }));

    it('should not allow adding more mines than mineable cells', inject(function(Grid) {
      var g = new Grid(3, 5);

      expect(function() {
        g.addMines(15, {row: 1, column: 2});
      }).toThrow();
    }));

    it('should allow a cell to be excluded', inject(function(Grid) {
      var g = new Grid(3, 3);

      g.addMines(8, {row: 1, column: 2});

      var excluded = g.getCell(1, 2);
      expect(excluded.mined).toEqual(false);
    }));

    it('should figure out adjacent mines for all cells', inject(function(Grid) {
      var g = new Grid(2, 2);

      g.addMines(3, {row: 0, column: 0});

      var topLeft = g.getCell(0, 0);
      var topRight = g.getCell(0, 1);
      var botLeft = g.getCell(1, 0);
      var botRight = g.getCell(1, 1);

      expect(topLeft.adjacentMines).toEqual(3);
      expect(topRight.adjacentMines).toEqual(2);
      expect(botLeft.adjacentMines).toEqual(2);
      expect(botRight.adjacentMines).toEqual(2);
    }));
  });
});
