import { World } from './ecs.js';

import {Velocity, Position} from './components.js'
import { MovementProcessor } from './movement_processor.js'
import {ActionProcessor} from './action_processor.js'

import { State } from './js_game_vars.js';

import { map_create } from './arena_map.js';

import { draw } from './index.js'

console.log("Game...");


function setup() {
    console.log("setup...")
    let world = new World();

    //processors
    var movement_processor = new MovementProcessor ();
	  var action_processor = new ActionProcessor ();
  	world.add_processor (action_processor);
	world.add_processor (movement_processor);

    // Create entities and assign components
    var player = world.create_entity()
    world.add_component(player, new Position(2,2))
    world.add_component(player, new Velocity())

    //generate map
    var map = map_create([[12, 14], [16,18]])


    // Save state 
    State.world = world
    State.map = map
    
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
    for (var [ent, pos] of State.world.get_component (Position)) {
      return pos;
    }
};

var get_map = function() {
    return State.map;
}

export { get_position, get_map, setup, act_and_update }