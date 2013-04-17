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
});
