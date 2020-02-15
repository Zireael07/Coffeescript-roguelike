// Generated by CoffeeScript 2.5.1
var MovementProcessor;

import {
  Position,
  Velocity,
  TileBlocker,
  Combat,
  Pause,
  Cursor,
  TurnComponent,
  Door,
  VisibilityBlocker,
  Renderable,
  Lock
} from '../components.js';

import {
  TileTypes
} from '../enums.js';

import {
  State
} from '../js_game_vars.js';

import {
  show_codepad
} from '../keypad.js';

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
          if (this.world.component_for_entity(ent_target, Lock)) {
            // can't go through, message 
            //State.messages.push [ "This is protected by a lock", [255,255,255] ]
            show_codepad(ent_target);
            tx = pos.x;
            ty = pos.y;
            // stays our turn
            this.world.add_component(ent, new Pause());
            continue;
          }
          if (this.world.component_for_entity(ent_target, Door)) {
            // open, unblock visibility and movement
            this.world.component_for_entity(ent_target, Door).open = true;
            this.world.remove_component(ent_target, TileBlocker);
            this.world.remove_component(ent_target, VisibilityBlocker);
            // change glyph
            this.world.component_for_entity(ent_target, Renderable).char = "±";
          } else {
            // Trigger a bump attack here
            console.log("Attacking " + ent_target + " @ " + pos_tg);
            this.world.add_component(ent, new Combat(ent_target));
          }
        }
      }
      // move (if no combat going on)
      //console.log @world.component_for_entity(ent, Combat)
      if (!this.world.component_for_entity(ent, Combat)) {
        console.log("move...");
        pos.x = tx;
        pos.y = ty;
      }
    }
    // the next processor is AI so remove the turn component
    // no longer our turn, AI now acts
    if (!(this.world.component_for_entity(ent, Pause) || this.world.component_for_entity(ent, Cursor))) {
      console.log("Removing turn component...");
      this.world.remove_component(ent, TurnComponent); // avoid implicit return
    }
  }

};

export {
  MovementProcessor
};
