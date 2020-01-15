// Generated by CoffeeScript 2.5.0
var CombatProcessor;

import {
  Combat,
  Stats,
  Name,
  Dead,
  Player,
  Equipped,
  MeleeBonus
} from './components.js';

import {
  State
} from './js_game_vars.js';

CombatProcessor = class CombatProcessor {
  
    constructor() {
      this.world = undefined
    }
    // constructor ->
    //     @world = undefined
    //     @action = null
    ;

  process() {
    var attacker_id, attacker_name, attacker_stats, bonus, color, combat, comps, damage, ent, equipped, i, item_ent, j, len, len1, player_hit, ref, ref1, target_id, target_name, target_stats;
    ref = this.world.get_component(Combat);
    for (i = 0, len = ref.length; i < len; i++) {
      [ent, combat] = ref[i];
      attacker_id = ent;
      target_id = combat.target_id;
      attacker_stats = this.world.component_for_entity(attacker_id, Stats);
      target_stats = this.world.component_for_entity(target_id, Stats);
      // deal damage!
      damage = attacker_stats.power;
      ref1 = this.world.get_components(Equipped, MeleeBonus);
      // any bonuses?
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        [item_ent, comps] = ref1[j];
        [equipped, bonus] = comps;
        if (equipped.owner === attacker_id) {
          console.log("Applying melee bonus");
          damage += bonus.bonus;
        }
      }
      target_stats.hp -= damage;
      // dead
      if (target_stats.hp <= 0) {
        this.world.add_component(target_id, new Dead());
      }
      //console.log("Killed target... " + target_id)

      // message
      attacker_name = this.world.component_for_entity(attacker_id, Name);
      target_name = this.world.component_for_entity(target_id, Name);
      // color
      player_hit = this.world.component_for_entity(target_id, Player);
      color = [255, 255, 255];
      if (player_hit) {
        color = [255, 0, 0];
      } else {
        color = [
          127,
          127,
          127 // libtcod light gray
        ];
      }
      State.messages.push([attacker_name.name + " attacks " + target_name.name + " for " + damage + " damage!", color]);
      // cleanup
      this.world.remove_component(ent, Combat); // avoid coffeescript's implicit return
    }
  }

};

export {
  CombatProcessor
};