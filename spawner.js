// Generated by CoffeeScript 2.5.0
var spawn_item, spawn_npc, spawn_player;

import {
  Position,
  Player,
  Faction,
  Skills,
  Attributes,
  TurnComponent,
  Name,
  Stats,
  Velocity,
  NPC,
  TileBlocker,
  Item
} from './components.js';

import {
  generate_random_item,
  generate_random_NPC
} from './random_utils.js';

import {
  generate_npc,
  generate_item
} from './generators.js';

import {
  State
} from './js_game_vars.js';

import {
  random_free_tile
} from './map_common.js';

spawn_player = function(world) {
  var player;
  player = world.create_entity();
  world.add_component(player, new Position(2, 2));
  world.add_component(player, new Player());
  world.add_component(player, new Name("Player"));
  world.add_component(player, new TurnComponent());
  world.add_component(player, new Stats(20, 4));
  world.add_component(player, new Faction("player"));
  world.add_component(player, new Skills());
  world.add_component(player, new Attributes(15, 14, 13, 12, 8, 10)); // avoid implicit return
};

spawn_npc = function(world) {
  var add, choice, i, j, loc, npc, ref, x, y;
  // Choose a random free location in the map
  //x = State.rng.range(1, 18);
  //y = State.rng.range(1, 18);
  loc = random_free_tile(State.map);
  [x, y] = loc;
  choice = generate_random_NPC();
  npc = world.create_entity([new Position(x, y), new Velocity(), new NPC(), new TileBlocker(), new Skills(), new Attributes()]);
  if (choice === null || choice === void 0) {
    return;
  }
  //fill in the rest
  add = generate_npc(choice.toLowerCase());
//add them
  for (i = j = 0, ref = add.length - 1; (0 <= ref ? j <= ref : j >= ref); i = 0 <= ref ? ++j : --j) {
    world.add_component(npc, add[i]);
  }
};

spawn_item = function(world) {
  var add, choice, i, it, j, loc, ref, x, y;
  // Choose a random location in the map
  //x = State.rng.range(1, 18)
  //y = State.rng.range(1, 18)
  loc = random_free_tile(State.map);
  [x, y] = loc;
  choice = generate_random_item();
  // things that all NPCs share
  it = world.create_entity([new Position(x, y), new Item()]);
  if (choice === null || choice === void 0) {
    return;
  }
  //fill in the rest
  add = generate_item(choice.toLowerCase());
//add them
  for (i = j = 0, ref = add.length - 1; (0 <= ref ? j <= ref : j >= ref); i = 0 <= ref ? ++j : --j) {
    world.add_component(it, add[i]);
  }
};

export {
  spawn_player,
  spawn_item,
  spawn_npc
};
