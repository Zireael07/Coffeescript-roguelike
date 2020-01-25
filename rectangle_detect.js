// Generated by CoffeeScript 2.5.0
var debug_rect, largest_area_rects, num_unbroken_floors_columns, run_rectangle_detection, sort_fun, unbroken_floors_columns_get;

import {
  Directions,
  TileTypes
} from './enums.js';

import {
  Rect
} from './map_common.js';

import {
  max_rectangle_histogram
} from './max_rectangle_hist.js';

num_unbroken_floors_columns = function(inc_map) {
  var add, i, j, k, l, north, num_floors, ref, ref1, ref2, ref3, x, y;
  //num_floors = [[0 for _ in range(len(inc_map[0]))] for _ in range(len(inc_map))]
  num_floors = [];
  for (x = i = 0, ref = inc_map.length; (0 <= ref ? i <= ref : i >= ref); x = 0 <= ref ? ++i : --i) {
    num_floors.push([]);
    for (y = j = 0, ref1 = inc_map[0].length; (0 <= ref1 ? j <= ref1 : j >= ref1); y = 0 <= ref1 ? ++j : --j) {
      num_floors[x].push(0);
    }
  }
// width
//console.log(num_floors)

  //console.log("North: " + Directions.NORTH)
  for (x = k = 0, ref2 = inc_map.length - 1; (0 <= ref2 ? k <= ref2 : k >= ref2); x = 0 <= ref2 ? ++k : --k) {
//height
    for (y = l = 0, ref3 = inc_map[0].length - 1; (0 <= ref3 ? l <= ref3 : l >= ref3); y = 0 <= ref3 ? ++l : --l) {
      // paranoia
      north = [x + Directions.NORTH[0], y + Directions.NORTH[1]];
      add = y === 0 ? 0 : num_floors[north[0]][north[1]];
      
      //console.log("North: " + north)
      num_floors[x][y] = inc_map[x][y] === TileTypes.FLOOR ? 1 + add : 0;
    }
  }
  return num_floors;
};

// parse it nicely
unbroken_floors_columns_get = function(num_floors) {
  var floors, i, j, ref, ref1, row, x, y;
  floors = [];
  for (y = i = 0, ref = num_floors.length - 1; (0 <= ref ? i <= ref : i >= ref); y = 0 <= ref ? ++i : --i) {
    row = [];
    for (x = j = 0, ref1 = num_floors[0].length - 1; (0 <= ref1 ? j <= ref1 : j >= ref1); x = 0 <= ref1 ? ++j : --j) {
      row.push(num_floors[x][y]);
    }
    floors.push(row);
  }
  return floors;
};

sort_fun = function(a, b) {
  return a - b;
};

// step two of finding rectangle of floor in matrix
// https://stackoverflow.com/a/12387148
largest_area_rects = function(floors) {
  var i, rect, rects, ref, sorted, y, y_min;
  rects = [];
  // reverse order
  y_min = floors.length - 2;
  for (y = i = ref = y_min; (ref <= 0 ? i <= 0 : i >= 0); y = ref <= 0 ? ++i : --i) {
    //console.log("Index: " + y)
    //console.log(floors[y])
    rect = max_rectangle_histogram(floors[y], y);
    rects.push(rect);
  }
  // this sorts in descending order
  sorted = rects.sort(sort_fun);
  //console.log sorted
  // .. so we need the first entry
  return sorted[0];
};

run_rectangle_detection = function(mapa) {
  var big_rect, floors, h, index, largest, row_floors, w;
  floors = num_unbroken_floors_columns(mapa);
  // get tidy rows from the floors 2d array
  row_floors = unbroken_floors_columns_get(floors);
  //print(row_floors)
  largest = largest_area_rects(row_floors);
  big_rect = largest[1];
  index = largest[2];
  w = big_rect.x2 - big_rect.x1;
  h = big_rect.y2 - big_rect.y1;
  console.log("Largest: " + "index: " + index + " x " + big_rect.x1 + ",y " + big_rect.y1 + " w: " + w + " h: " + h);
  // " to x: " + str(big_rect.x2) + ",y: " + str(big_rect.y2))
  return big_rect;
};

debug_rect = function(rect, mapa) {
  var i, ref, ref1, results, x, y;
  console.log(rect);
  results = [];
  for (x = i = ref = rect.x1, ref1 = rect.x2; (ref <= ref1 ? i <= ref1 : i >= ref1); x = ref <= ref1 ? ++i : --i) {
    results.push((function() {
      var j, ref2, ref3, results1;
      results1 = [];
      for (y = j = ref2 = rect.y1, ref3 = rect.y2; (ref2 <= ref3 ? j <= ref3 : j >= ref3); y = ref2 <= ref3 ? ++j : --j) {
        results1.push(mapa[x][y] = TileTypes.DEBUG);
      }
      return results1;
    })());
  }
  return results;
};

export {
  run_rectangle_detection,
  debug_rect
};