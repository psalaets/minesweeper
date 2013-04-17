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
});
