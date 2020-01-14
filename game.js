import { World } from './ecs.js';

import {Velocity, Position, Player, TurnComponent, Renderable, NPC, Stats, TileBlocker, Name, Dead, Item, InBackpack, MedItem, Skip, Ranged, Wearable, MeleeBonus, Equipped} from './components.js'
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

import { generate_random_item } from './random_utils.js';

//console.log("Game...");

function setupProcessors(world, fov_ob){
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
}


function setup() {
    console.log("Game setup...")
		let world = new World();
		
		var rng = aleaPRNG();
		State.rng = rng;

    //FOV
    var fov_ob = new PermissiveFov(20, 20, transparent)
    var fov = init_FOV();
    State.fov = fov
    var explored = init_explored();
    State.explored = explored

    //processors
    setupProcessors(world, fov_ob);


    // Create entities and assign components
    var player = world.create_entity([])
    world.add_component(player, new Position(2,2))
    //world.add_component(player, new Velocity())
    world.add_component(player, new Player())
    world.add_component(player, new Name("Player"))
    world.add_component(player, new TurnComponent())
    world.add_component(player, new Stats(20, 4))


    // Create some npcs
    var num_npc = 2;
    for (let i = 0; i < num_npc; i++){
			// Choose a random location in the map
			let x = State.rng.range(1, 18)
			let y = State.rng.range(1, 18)
      let npc = world.create_entity(
          [new Position(x, y),
          new Renderable('h', [255, 255, 255]),
          new Velocity(),
          new NPC(),
          new Name("human"),
          new TileBlocker(),
          new Stats(11, 2)
        ]
      ) 
    }

		//some items
		var num_items = 3;
		for (let i = 0; i < num_items; i++){
			let x = State.rng.range(1, 18)
			let y = State.rng.range(1, 18)

			var choice = generate_random_item()

			if (choice == "Medkit"){
				console.log("Want to spawn medkit")
				let it = world.create_entity(
					[new Item(),
					new Position(x,y),
					new Renderable("!", [255,0,0]),
					new Name("Medkit"),
					new MedItem(6)
				]
				)
			}
			else if (choice == "Combat Knife"){
				console.log("Want to spawn combat knife")
				let it = world.create_entity(
					[new Item(), new Position(x,y),
					new Renderable("/", [0,255,255]),
          new Name("Combat Knife"),
          new Wearable("MAIN_HAND"),
          new MeleeBonus(2)
        ]
				)
			}
		}

		let x = State.rng.range(1, 18)
		let y = State.rng.range(1, 18)
    let it = world.create_entity(
      [ new Item(),
      new Position(x,y),
      new Renderable(")", [0, 255, 0]),
      new Name("Pistol"),
      new Ranged(6)
    ]
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
    for (var [item_ent, comps] of State.world.get_components(Name, InBackpack)){
      //skip entities that are being removed
      if (State.world.component_for_entity(item_ent, Skip)){
        continue
      }
      [name, pack] = comps;
      inventory.push([String.fromCharCode(letter_index), name.name, item_ent])
      letter_index += 1;
    }
    for (var [item_ent, comps] of State.world.get_components(Name, Equipped)){
      //skip entities that are being removed
      if (State.world.component_for_entity(item_ent, Skip)){
        continue
      }
      [name, pack] = comps;
      inventory.push([String.fromCharCode(letter_index), name.name + " (equipped)", item_ent])
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

function onStateLoaded(loaded_State){
  //JSON serialization loses functions
  Object.assign(State.world, loaded_State.world)
  //State.world = loaded_State.world;
  //clear
  State.world.processors.length = 0
  //setup processors again
  //FOV
  var fov_ob = new PermissiveFov(20, 20, transparent)
	setupProcessors(State.world, fov_ob);
	var rng = aleaPRNG();
	State.rng = rng;
  //work around the fact that sets don't load automatically
  State.world.dead_entities = new Set() //.clear()
  loaded_State.world.dead_entities.forEach(item => State.world.dead_entities.add(item))


  //those work directly
  State.map = loaded_State.map;
  State.fov = loaded_State.fov;
  State.explored = loaded_State.explored;
  State.messages = loaded_State.messages;

  //State = loaded_State;

  //redraw
  draw()
}

export { get_position, get_stats, get_inventory, get_map, get_fov, setup, act_and_update, onStateLoaded }