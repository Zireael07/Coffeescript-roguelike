// Generated by CoffeeScript 2.5.0
var Rect, drawn_wall_glyph, get_free_tiles, glyph_lookup, is_wall, random_free_tile, tiles_distance_to;

import {
  TileTypes
} from './enums.js';

import {
  State
} from './js_game_vars.js';

Rect = class Rect {
  constructor(x, y, w, h) {
    this.x1 = x;
    this.y1 = y;
    this.x2 = x + w;
    this.y2 = y + h;
    // shortcuts
    this.w = w;
    this.h = h;
  }

  center() {
    var cent, centerX, centerY;
    centerX = (this.x1 + this.x2) / 2;
    centerY = (this.y1 + this.y2) / 2;
    console.log(centerX + " " + centerY);
    cent = [centerX, centerY];
    return cent;
  }

  intersect(other) {
    var int;
    //returns true if this rectangle intersects with another one
    int = this.x1 <= this.x2 && this.x2 >= other.x1 && this.y1 <= other.y2 && this.y2 >= other.y1;
    return int;
  }

};

get_free_tiles = function(inc_map) {
  var free_tiles, i, j, max_x, max_y, ref, ref1, x, y;
  free_tiles = [];
  max_y = inc_map[0].length - 1;
  max_x = inc_map.length - 1;
  for (y = i = 0, ref = max_y; (0 <= ref ? i <= ref : i >= ref); y = 0 <= ref ? ++i : --i) {
    for (x = j = 0, ref1 = max_x; (0 <= ref1 ? j <= ref1 : j >= ref1); x = 0 <= ref1 ? ++j : --j) {
      if (!TileTypes.data[inc_map[x][y]].block_path) {
        free_tiles.push([x, y]);
      }
    }
  }
  return free_tiles;
};

random_free_tile = function(inc_map) {
  var free_tiles, index, tile, x, y;
  free_tiles = get_free_tiles(inc_map);
  index = State.rng.range(0, free_tiles.length - 1);
  //console.log("Index is " + index)
  x = free_tiles[index][0];
  y = free_tiles[index][1];
  console.log("Coordinates are " + x + " " + y);
  tile = [x, y];
  return tile;
};

tiles_distance_to = function(start, target) {
  var x_diff, y_diff;
  x_diff = start[0] - target[0];
  y_diff = start[1] - target[1];
  //#ensure always positive values
  if (x_diff < 0) {
    x_diff = x_diff * -1;
  }
  if (y_diff < 0) {
    y_diff = y_diff * -1;
  }
  return Math.max(x_diff, y_diff);
};

// based on RLTK-rs tutorial
glyph_lookup = {
  0: "○", //pillar
  1: "║", // wall only to the north
  2: "║", // wall only to the south
  3: "║", // wall only to the north and south
  4: "═", // wall only to the west
  5: "╝", // wall to north and west
  6: "╗", // wall to south and west
  7: "╣", // wall to the north, south and west
  8: "═", // wall only to the east
  9: "╚", // wall to the north and east
  10: "╔", // wall to the south and east
  11: "╠", // wall to the south, north and east
  12: "═", // wall to the east and west
  13: "╩", // wall to the east, west and south
  14: "╦" // wall to the east, west and north
};

drawn_wall_glyph = function(inc_map, x, y) {
  var mask;
  // don't check if we would go past map borders
  if (x < 1 || y < 1 || x > inc_map.length - 1 || y > inc_map[0].length - 1) {
    return "#";
  }
  // bitmask
  mask = 0;
  if (is_wall(inc_map, x, y - 1)) {
    mask += 1;
  }
  if (is_wall(inc_map, x, y + 1)) {
    mask += 2;
  }
  if (is_wall(inc_map, x - 1, y)) {
    mask += 4;
  }
  if (is_wall(inc_map, x + 1, y)) {
    mask += 8;
  }
  // assign tiles
  if (mask in glyph_lookup) { // object presence
    return glyph_lookup[mask];
  } else {
    return "#";
  }
};

is_wall = function(inc_map, x, y) {
  return inc_map[x][y] === TileTypes.WALL;
};

export {
  tiles_distance_to,
  random_free_tile,
  Rect,
  drawn_wall_glyph
};
