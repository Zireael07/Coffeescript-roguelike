// Generated by CoffeeScript 2.5.0
var UseItemProcessor;

import {
  WantToUseItem,
  MedItem,
  Stats,
  Name,
  Skip,
  Ranged,
  Position,
  Cursor,
  Wearable,
  Equipped,
  InBackpack
} from '../components.js';

import {
  State
} from '../js_game_vars.js';

import {
  tiles_distance_to
} from '../map_common.js';

UseItemProcessor = class UseItemProcessor {
  
    constructor() {
      this.world = undefined
    }
    // constructor ->
    //     @world = undefined
    //     @action = null
    ;

  process() {
    var comps, ent, ent_name, equipped, i, item_ent, item_id, item_name, j, k, len, len1, len2, name, player_pos, pos, ranged, ref, ref1, ref2, slot, stats, targeted, tg_ent, tg_name, tg_x, tg_y, user_stats, value, want;
    ref = this.world.get_component(WantToUseItem);
    for (i = 0, len = ref.length; i < len; i++) {
      [ent, want] = ref[i];
      item_id = want.item_id;
      // if item is a med item
      if (this.world.component_for_entity(item_id, MedItem)) {
        value = this.world.component_for_entity(item_id, MedItem).heal;
        user_stats = this.world.component_for_entity(ent, Stats);
        // heal
        user_stats.hp += value;
        if (user_stats.hp > user_stats.max_hp) {
          user_stats.hp = user_stats.max_hp;
        }
        // message
        name = this.world.component_for_entity(ent, Name);
        item_name = this.world.component_for_entity(item_id, Name);
        State.messages.push([name.name + " uses " + item_name.name + ", healing " + value + " hp!", [0, 255, 0]]);
        // cleanup
        this.world.add_component(item_id, new Skip()); // using it to mark item as being removed
        this.world.delete_entity(item_id);
      }
      // equip/unequip
      if (this.world.component_for_entity(item_id, Wearable)) {
        // if not equipped already
        if (!this.world.component_for_entity(item_id, Equipped)) {
          slot = this.world.component_for_entity(item_id, Wearable).slot;
          ref1 = this.world.get_components(Equipped, Name);
          // unequip anything we might have in the slot
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            [item_ent, comps] = ref1[j];
            [equipped, name] = comps;
            if (equipped.slot = slot && (equipped.owner = ent)) {
              ent_name = this.world.component_for_entity(ent, Name);
              State.messages.push([ent_name.name + " unequips " + name.name, [255, 255, 255]]);
              this.world.remove_component(item_ent, Equipped);
              this.world.add_component(item_ent, new InBackpack());
            }
          }
          // equip
          this.world.add_component(item_id, new Equipped(slot, ent));
          this.world.remove_component(item_id, InBackpack);
          ent_name = this.world.component_for_entity(ent, Name);
          item_name = this.world.component_for_entity(item_id, Name);
          State.messages.push([ent_name.name + " equips " + item_name.name, [255, 255, 255]]);
        } else {
          // unequip
          ent_name = this.world.component_for_entity(ent, Name);
          item_name = this.world.component_for_entity(item_id, Name);
          State.messages.push([ent_name.name + " unequips " + name.name, [255, 255, 255]]);
          this.world.remove_component(item_ent, Equipped);
          this.world.add_component(item_ent, new InBackpack());
        }
      }
      // if item is a ranged item and we have a cursor
      if (this.world.component_for_entity(item_id, Ranged)) {
        ranged = this.world.component_for_entity(item_id, Ranged);
        player_pos = this.world.component_for_entity(ent, Position);
        if (this.world.component_for_entity(ent, Cursor)) {
          tg_x = this.world.component_for_entity(ent, Cursor).x;
          tg_y = this.world.component_for_entity(ent, Cursor).y;
          if (tiles_distance_to([player_pos.x, player_pos.y], [tg_x, tg_y]) > ranged.range) {
            console.log("Distance exceeded");
            // remove cursor
            this.world.remove_component(ent, Cursor);
          } else {
            // is there an entity?
            targeted = null;
            ref2 = this.world.get_components(Position, Stats);
            for (k = 0, len2 = ref2.length; k < len2; k++) {
              [tg_ent, comps] = ref2[k];
              [pos, stats] = comps;
              if (pos.x === tg_x && pos.y === tg_y) {
                targeted = tg_ent;
                stats.hp -= 6; //dummy
                
                // message
                name = this.world.component_for_entity(ent, Name);
                tg_name = this.world.component_for_entity(tg_ent, Name);
                State.messages.push([name.name + " shoots " + tg_name.name + " for 6 damage!", [255, 0, 0]]);
              }
            }
            if (targeted === null) {
              State.messages.push(["No target selected", [255, 255, 255]]);
            } else {
              // be nice, only take the item away if there's a target
              this.world.add_component(item_id, new Skip()); // using it to mark item as being removed
              this.world.delete_entity(item_id);
            }
            // remove cursor
            this.world.remove_component(ent, Cursor);
          }
        }
      }
      // cleanup
      this.world.remove_component(ent, WantToUseItem); // avoid coffeescript's implicit return
    }
  }

};

export {
  UseItemProcessor
};
