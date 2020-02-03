// Generated by CoffeeScript 2.5.0
var MovementProcessor;

import {
  Position,
  Velocity,
  TileBlocker,
  Combat
} from '../components.js';

import {
  TileTypes
} from '../enums.js';

import {
  State
} from '../js_game_vars.js';

MovementProcessor = class MovementProcessor {
  
    constructor() {
      this.world = undefined;
    }
    // constructor ->
    //     @world = undefined
    ;

  process() {
    var blocker, comps, ent, ent_target, i, j, len, len1, pos, pos_tg, ref, ref1, tx, ty, vel;
    ref = this.world.get_components(Velocity, Position);
    // destructuring assignment
    for (i = 0, len = ref.length; i < len; i++) {
      [ent, comps] = ref[i];
      //console.log "Components: " + comps
      [vel, pos] = comps;
      //console.log "Vel: " + vel.dx  + " " + vel.dy + " pos: " + pos
      if (vel.dx === 0 && vel.dy === 0) {
        // skip entity
        continue;
      }
      tx = pos.x + vel.dx;
      ty = pos.y + vel.dy;
      //console.log "tx: " + tx + " ty: " + ty
      vel.dx = 0;
      vel.dy = 0;
      // don't walk out of map
      if (tx < 0 || tx > State.map.length || ty < 0 || ty > State.map[0].length) {
        continue;
      }
      // check for unwalkable tiles
      if (TileTypes.data[State.map[tx][ty]].block_path) {
        continue;
      }
      ref1 = this.world.get_components(TileBlocker, Position);
      // check for entities
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        [ent_target, comps] = ref1[j];
        [blocker, pos_tg] = comps;
        if (pos_tg.x === tx && pos_tg.y === ty) {
          // Trigger a bump attack here
          console.log("Attacking " + ent_target + " @ " + pos_tg);
          this.world.add_component(ent, new Combat(ent_target));
        }
      }
      // move (if no combat going on)
      //console.log @world.component_for_entity(ent, Combat)
      if (!this.world.component_for_entity(ent, Combat)) {
        console.log("move...");
        pos.x = tx;
        pos.y = ty; // avoid implicit return
      }
    }
  }

};

export {
  MovementProcessor
};
