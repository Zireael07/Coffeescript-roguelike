import { World } from './ecs.js';

import {Position, Player, Stats, Name, Dead, InBackpack, Skip, Equipped} from './components.js'
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

import { Camera } from './camera.js';
import { draw, initial_draw } from './index.js'
import { PermissiveFov } from './3rd-party/ppfov/index.js';

import { pipeWith} from './pipe.js';

//import { map_create } from './arena_map.js';
import { map_create } from './noise_map.js';
import { map_create as bsp_map_create } from './bsp_map.js';
import { apply_rectangle_detection } from './rectangle_detect.js';

import { spawn_player, spawn_npc, spawn_item } from './spawner.js';

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

function loadData() {
  $.ajax({
    url: "./npcs.json",
    type: "GET",
    success: function(response){
      console.log("Game data loaded...");  
      //console.log(response)
        State.npc_data = response;
        //console.log("Success");

        //now load second file
        $.ajax({
          url: "./items.json",
          type: "GET",
          success: function(resp){
            State.items_data = resp;
            setup();
            initial_draw();

          }
        });
        
    }
  });
}


function setup() {
    console.log("Game setup...")

    //loadData();

		let world = new World();
		
		var rng = aleaPRNG();
		State.rng = rng;

    //FOV
    var fov_ob = new PermissiveFov(40, 40, transparent)
    var fov = init_FOV(fov_ob);
    State.fov = fov
    var explored = init_explored(fov_ob);
    State.explored = explored

    var cam = new Camera();

    //processors
    setupProcessors(world, fov_ob);

    //generate map
    //var map = map_create([[12, 14], [16,18]])
    var level = map_create(40,40)
    //chain methods
    pipeWith(level, apply_rectangle_detection, bsp_map_create )

    State.map = level.mapa

    // Create entities and assign components
    spawn_player(world);


    // Create some npcs
    var num_npc = 2;
    for (let i = 0; i < num_npc; i++){
      spawn_npc(world);
    }

		//some items
		var num_items = 3;
		for (let i = 0; i < num_items; i++){
      spawn_item(world);
    }

    //FOV
    fov_ob.compute(2,2, 6, explore)


    // Save state 
    State.world = world
    State.camera = cam
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

  Object.assign(State.camera, loaded_State.camera)

  //those work directly
  State.map = loaded_State.map;
  State.fov = loaded_State.fov;
  State.explored = loaded_State.explored;
  State.messages = loaded_State.messages;

  //State = loaded_State;

  //redraw
  draw()
}

export { get_position, get_stats, get_inventory, get_map, get_fov, loadData, setup, act_and_update, onStateLoaded }