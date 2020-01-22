// Generated by CoffeeScript 2.5.0
var map_create;

import {
  Simplex
} from './3rd-party/rotjs/simplex.js';

import {
  TileTypes
} from './enums.js';

map_create = function() {
  var i, j, k, l, m, n, new_map, noise, o, x, y;
  //new_map = [[ get_index(TileTypes.FLOOR) for _ in range(0, constants.MAP_HEIGHT)] for _ in range(0, constants.MAP_WIDTH)]
  new_map = [];
  for (x = k = 0; k <= 20; x = ++k) {
    new_map.push([]);
    for (y = l = 0; l <= 20; y = ++l) {
      new_map[x].push([TileTypes.FLOOR]);
    }
  }
  // basic noise
  noise = new Simplex();
// create the map
  for (x = m = 0; m <= 20; x = ++m) {
    for (y = o = 0; o <= 20; y = ++o) {
      i = x;
      j = y;
      n = noise.get(i / 20, j / 20) * 255; // because default values are very small
      //console.log "noise: " + n 
      if (n >= 0) {
        new_map[x][y] = TileTypes.WALL;
      } else {
        new_map[x][y] = TileTypes.FLOOR;
      }
    }
  }
  return new_map;
};

export {
  map_create
};
