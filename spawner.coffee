import { Position, Player, Faction, Skills, Attributes, TurnComponent, Name, Stats, Velocity, NPC, TileBlocker, Item, Equipped, Wearable } from './components.js'
import { generate_random_item, generate_random_NPC } from './random_utils.js';
import { generate_npc, generate_item, generate_prop } from './generators.js';
import { State } from './js_game_vars.js';
import { random_free_tile } from './map_common.js';

spawn_player = (world) ->
    player = world.create_entity()

    loc = [2,2]
    # destructuring assignment
    [x,y] = loc
    world.add_component(player, new Position(x,y))
    world.add_component(player, new Player())
    world.add_component(player, new Name("Player"))
    world.add_component(player, new TurnComponent())
    world.add_component(player, new Stats(20, 4))
    world.add_component(player, new Faction("player"))
    world.add_component(player, new Skills())
    world.add_component(player, new Attributes(15, 14, 13, 12, 8, 10))

    equip_list = ["Baton", "T-shirt", "Jeans", "Boots"]
    for i in [0..equip_list.length-1]
        id = equip_list[i]
        spawn_named_item(world, loc, id.toLowerCase(), player)

    return # avoid implicit return

spawn_npc = (world) ->
	# Choose a random free location in the map
    #x = State.rng.range(1, 18);
    #y = State.rng.range(1, 18);
    loc = random_free_tile(State.map);
    # destructuring assignment
    [x,y] = loc
      
    choice = generate_random_NPC();

    # things that all NPCs share
    npc = world.create_entity(
          [new Position(x, y), new Velocity(), new NPC(), new TileBlocker(), new Skills(), new Attributes() ]
    )

    if choice == null or choice == undefined
        return

    #fill in the rest
    [add, equip_list] = generate_npc(choice.toLowerCase())
    #add them
    for i in [0..add.length-1]
        world.add_component(npc, add[i])

    for i in [0..equip_list.length-1]
        id = equip_list[i]
        spawn_named_item(world, [x,y], id, npc)

    return # avoid implicit return

spawn_item = (world) ->
    # Choose a random location in the map
    #x = State.rng.range(1, 18)
    #y = State.rng.range(1, 18)
    loc = random_free_tile(State.map);
    # destructuring assignment
    [x,y] = loc

    choice = generate_random_item()

    # things that all items share
    it = world.create_entity(
          [ new Position(x,y), new Item() ]
    )

    if choice == null or choice == undefined
        return

    #fill in the rest
    add = generate_item(choice.toLowerCase())
    #add them
    for i in [0..add.length-1]
        world.add_component(it, add[i])

    return # avoid implicit return

spawn_named_item = (world, pos, id, ent_equipped=null) ->
    # destructuring assignment
    [x,y] = pos
    # things that all items share
    it = world.create_entity(
          [ new Position(x,y), new Item() ]
    )
    #fill in the rest
    add = generate_item(id.toLowerCase())
    #add them
    for i in [0..add.length-1]
        world.add_component(it, add[i])

    if ent_equipped != null
        world.add_component(it, new Equipped(world.component_for_entity(it, Wearable).slot, ent_equipped))
        console.log("Spawned an equipped item... " + world.component_for_entity(it, Name).name)


spawn_prop = (world, pos, id) ->
    # destructuring assignment
    [x,y] = pos
    prop = world.create_entity(
        [ new Position(x,y)]
    )

    #fill in the rest
    add = generate_prop(id.toLowerCase())
    #add them
    for i in [0..add.length-1]
        world.add_component(prop, add[i])

    console.log "Spawned prop ..." + id + " @ " + pos
    #console.log prop
    return # avoid implicit return

export { spawn_player, spawn_item, spawn_npc, spawn_prop}