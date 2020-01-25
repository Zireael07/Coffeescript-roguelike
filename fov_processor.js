// Generated by CoffeeScript 2.5.0
var FovProcessor, block_sight, explore, init_FOV, init_explored, transparent, update_FOV;

import {
  Player,
  Position
} from './components.js';

import {
  PermissiveFov
} from './3rd-party/ppfov/index.js';

import {
  TileTypes
} from './enums.js';

import {
  State
} from './js_game_vars.js';

explore = function(x, y) {
  State.fov[x][y] = 1;
  State.explored[x][y] = 1;
};

//console.log State.explored[x][y]
block_sight = function(x, y) {
  return TileTypes.data[State.map[x][y]].block_path;
};

transparent = function(x, y) {
  return !block_sight(x, y);
};

init_FOV = function(fov_ob) {
  var fov, i, j, ref, ref1, x, y;
  fov = [];
  for (x = i = 0, ref = fov_ob.mapWidth; (0 <= ref ? i <= ref : i >= ref); x = 0 <= ref ? ++i : --i) {
    fov.push([]);
    for (y = j = 0, ref1 = fov_ob.mapHeight; (0 <= ref1 ? j <= ref1 : j >= ref1); y = 0 <= ref1 ? ++j : --j) {
      fov[x].push([0]);
    }
  }
  return fov;
};

init_explored = function(fov_ob) {
  var explored, i, j, ref, ref1, x, y;
  explored = [];
  for (x = i = 0, ref = fov_ob.mapWidth; (0 <= ref ? i <= ref : i >= ref); x = 0 <= ref ? ++i : --i) {
    explored.push([]);
    for (y = j = 0, ref1 = fov_ob.mapHeight; (0 <= ref1 ? j <= ref1 : j >= ref1); y = 0 <= ref1 ? ++j : --j) {
      explored[x].push([0]);
    }
  }
  return explored;
};

update_FOV = function(src_x, src_y, fov_ob) {
  var i, j, ref, ref1, x, y;
  // Generate FOV
  //game_vars.fov = [[0 for _ in range(constants.MAP_HEIGHT)] for _ in range(constants.MAP_WIDTH)]
  // Clear
  State.fov = [];
  for (x = i = 0, ref = fov_ob.mapWidth; (0 <= ref ? i <= ref : i >= ref); x = 0 <= ref ? ++i : --i) {
    State.fov.push([]);
    for (y = j = 0, ref1 = fov_ob.mapHeight; (0 <= ref1 ? j <= ref1 : j >= ref1); y = 0 <= ref1 ? ++j : --j) {
      State.fov[x].push([0]);
    }
  }
  fov_ob.compute(src_x, src_y, 6, explore);
};

FovProcessor = class FovProcessor {
  
    constructor(fov_ob) {
      this.world = undefined;
      this.fov_ob = fov_ob;
    }
    ;

  process() {
    var comps, ent, i, len, player, pos, ref, results;
    ref = this.world.get_components(Player, Position);
    //console.log("FOV processor...")
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      [ent, comps] = ref[i];
      [player, pos] = comps;
      //print("FOV process pos " + str(pos.x) + " " + str(pos.y))
      results.push(update_FOV(pos.x, pos.y, this.fov_ob));
    }
    return results;
  }

};

export {
  FovProcessor,
  init_FOV,
  init_explored,
  explore,
  block_sight,
  transparent,
  update_FOV
};
