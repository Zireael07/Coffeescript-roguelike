import { Position, Player, TurnComponent, Name, Stats, Velocity, NPC, TileBlocker, Item } from './components.js'
import { generate_random_item, generate_random_NPC } from './random_utils.js';
import { generate_npc, generate_item } from './generators.js';
import { State } from './js_game_vars.js';

spawn_player = (world) ->
    player = world.create_entity()
    world.add_component(player, new Position(2,2))
    world.add_component(player, new Player())
    world.add_component(player, new Name("Player"))
    world.add_component(player, new TurnComponent())
    world.add_component(player, new Stats(20, 4))

    return # avoid implicit return

spawn_npc = (world) ->
	# Choose a random location in the map
    x = State.rng.range(1, 18);
    y = State.rng.range(1, 18)
      
    choice = generate_random_NPC();

    # things that all NPCs share
    npc = world.create_entity(
          [new Position(x, y), new Velocity(), new NPC(), new TileBlocker() ]
    )
      
    #fill in the rest
    add = generate_npc(choice.toLowerCase())
    #add them
    for i in [0..add.length-1]
        world.add_component(npc, add[i])

    return # avoid implicit return

spawn_item = (world) ->
    # Choose a random location in the map
    x = State.rng.range(1, 18)
    y = State.rng.range(1, 18)

    choice = generate_random_item()

    # things that all NPCs share
    it = world.create_entity(
          [ new Position(x,y), new Item() ]
    )
      
    #fill in the rest
    add = generate_item(choice.toLowerCase())
    #add them
    for i in [0..add.length-1]
        world.add_component(it, add[i])

    return # avoid implicit return

export { spawn_player, spawn_item, spawn_npc}