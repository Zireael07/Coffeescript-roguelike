import { World } from './ecs.js';

import {Velocity, Position, Player, TurnComponent, Renderable, NPC, Stats, TileBlocker, Name, Dead, Item, InBackpack, MedItem, Skip} from './components.js'
import { MovementProcessor } from './movement_processor.js'
import {ActionProcessor} from './action_processor.js'
import { FovProcessor, init_FOV, init_explored, transparent, explore } from './fov_processor.js'
import { AIProcessor } from './ai_processor.js'
import { CombatProcessor } from './combat_processor.js'
import { DeathProcessor } from './death_processor.js'
import { PickupProcessor } from './pickup_processor.js'
import { UseItemProcessor } from './useitem_processor.js'
import { DropProcessor } from './drop_processor.js'

import { State } from './js_game_vars.js';

import { map_create } from './arena_map.js';

import { draw } from './index.js'
import { PermissiveFov } from './ppfov/index.js';

//console.log("Game...");


function setup() {
    console.log("Game setup...")
    let world = new World();

    //FOV
    var fov_ob = new PermissiveFov(20, 20, transparent)
    var fov = init_FOV();
    State.fov = fov
    var explored = init_explored();
    State.explored = explored

    //processors
    var movement_processor = new MovementProcessor ();
    var ai_processor = new AIProcessor();
    var action_processor = new ActionProcessor ();
    var pickup_processor = new PickupProcessor();
    var useitem_processor = new UseItemProcessor();
    var drop_processor = new DropProcessor();
    var combat_processor = new CombatProcessor();
    var death_processor = new DeathProcessor();
    var fov_processor = new FovProcessor (fov_ob);

    world.add_processor (action_processor);
    world.add_processor(pickup_processor);
    world.add_processor(useitem_processor);
    world.add_processor(drop_processor);
    world.add_processor (movement_processor);
    world.add_processor(ai_processor);
    world.add_processor(combat_processor);
    world.add_processor(death_processor)
    world.add_processor (fov_processor);

    // Create entities and assign components
    var player = world.create_entity([])
    world.add_component(player, new Position(2,2))
    //world.add_component(player, new Velocity())
    world.add_component(player, new Player())
    world.add_component(player, new Name("Player"))
    world.add_component(player, new TurnComponent())
    world.add_component(player, new Stats(20, 4))


    // Create some npcs
    let npc = world.create_entity(
        [new Position(4, 4),
        new Renderable('h', [255, 255, 255]),
        new Velocity(),
        new NPC(),
        new Name("human"),
        new TileBlocker(),
        new Stats(11, 2)
      ]
    ) 

    npc = world.create_entity(
        [new Position(12, 6),
        new Renderable('h', [255, 255, 255]),
        new Velocity(), new NPC(), new Name("human"), new TileBlocker(),
        new Stats(11, 2)]
    ) 

    //some items
    let it = world.create_entity(
      [new Item(),
      new Position(6,5),
      new Renderable("/", [0,255,255]),
      new Name("Combat Knife")]
    )

    it = world.create_entity(
      [new Item(),
      new Position(4,5),
      new Renderable("!", [255,0,0]),
      new Name("Medkit"),
      new MedItem(6)]
    )

    //generate map
    var map = map_create([[12, 14], [16,18]])


    State.map = map
    //FOV
    fov_ob.compute(2,2, 6, explore)


    // Save state 
    State.world = world
    State.messages = []

    //State.fov = fov
    
};  

//setup();  


var act_and_update = function (action) {
    //abort early if dead
    if (!is_player_alive()){
      console.log("Abort early, player dead")
      return;
    }


    //console.log(action);
    var processor = State.world.get_processor(ActionProcessor)
    //console.log(processor)
    processor.action = action
     //run the systems
    State.world.process()

    //redraw
    draw()
};


var get_position = function () {
    var player, pos;
    for (var [ent, comps] of State.world.get_components(Player, Position)) {
      [player, pos] = comps
      return pos;
    }
};

var get_stats = function() {
    var player, stats;
    for (var [ent, comps] of State.world.get_components(Player, Stats)){
      [player, stats] = comps
      return stats;
    }
}

var get_inventory = function() {
    var name, pack;
    var inventory = [];
    var letter_index = 'a'.charCodeAt(0);
    for (var [ent, comps] of State.world.get_components(Name, InBackpack)){
      //skip entities that are being removed
      if (State.world.component_for_entity(ent, Skip)){
        continue
      }
      [name, pack] = comps;
      inventory.push([String.fromCharCode(letter_index), name.name, ent])
      letter_index += 1;
    }

    return inventory;
}

var get_map = function() {
    return State.map;
}

var get_fov = function() {
  return State.fov;
}

var is_player_alive = function() {
  var alive;
  for (var [ent, comps] of State.world.get_components(Player, Position)){
    alive = !State.world.component_for_entity(ent, Dead);
    //console.log("Alive? " + alive);
    return alive;
  }
}

export { get_position, get_stats, get_inventory, get_map, get_fov, setup, act_and_update }