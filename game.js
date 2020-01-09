import { World } from './ecs.js';

import {Velocity, Position, Player, TurnComponent, Renderable} from './components.js'
import { MovementProcessor } from './movement_processor.js'
import {ActionProcessor} from './action_processor.js'
import { FovProcessor, init_FOV, init_explored, transparent, explore } from './fov_processor.js'

import { State } from './js_game_vars.js';

import { map_create } from './arena_map.js';

import { draw } from './index.js'
import { PermissiveFov } from './ppfov/index.js';

console.log("Game...");


function setup() {
    console.log("setup...")
    let world = new World();

    //FOV
    var fov_ob = new PermissiveFov(20, 20, transparent)
    var fov = init_FOV();
    State.fov = fov
    var explored = init_explored();
    State.explored = explored

    //processors
    var movement_processor = new MovementProcessor ();
    var action_processor = new ActionProcessor ();
    var fov_processor = new FovProcessor (fov_ob);
  	world.add_processor (action_processor);
    world.add_processor (movement_processor);
    world.add_processor (fov_processor);

    // Create entities and assign components
    var player = world.create_entity([])
    world.add_component(player, new Position(2,2))
    world.add_component(player, new Velocity())
    world.add_component(player, new Player())
    world.add_component(player, new TurnComponent())


    // Create some npcs
    let npc = world.create_entity(
        [new Position(4, 4),
        new Renderable('h', [255, 255, 255]),
        new Velocity()]
    ) 

    npc = world.create_entity(
        [new Position(12, 6),
        new Renderable('h', [255, 255, 255]),
        new Velocity()]
    ) 

    //generate map
    var map = map_create([[12, 14], [16,18]])


    State.map = map
    //FOV
    fov_ob.compute(2,2, 6, explore)


    // Save state 
    State.world = world

    //State.fov = fov
    
};  

//setup();  


var act_and_update = function (action) {
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

var get_map = function() {
    return State.map;
}

var get_fov = function() {
  return State.fov;
}

export { get_position, get_map, get_fov, setup, act_and_update }