import {TileTypes } from './enums.js'
import { State } from './js_game_vars.js';

import {Position, Renderable, Dead, InBackpack, Player, Cursor } from './components.js'

# console is a reserved name in JS
redraw_terminal = (position, inc_map, fov) ->
    terminal = get_terminal(inc_map, fov)

    # draw other entities
    for [ent, comps] in State.world.get_components(Position, Renderable)
        [pos, visual] = comps

        #console.log visual + " x : " + pos.x + " y :" + pos.y

        # if not in fov
        unless fov[pos.x][pos.y] == 1
            # skip
            continue
        # in backpack
        if State.world.component_for_entity(ent, InBackpack)
            # skip
            continue
        # if dead
        if State.world.component_for_entity(ent, Dead)
            # skip
            continue

        # draw
        terminal[pos.x][pos.y] = [visual.char, visual.color, "normal" ]

    # draw player
    terminal[position.x][position.y] = ['@', [255, 255, 255], "normal" ]

    # cursor
    cursor = null
    for [ent, comps] in State.world.get_components(Player, Cursor)
        [player, cur] = comps
        cursor = cur

    if cursor != null
        terminal[cursor.x][cursor.y][2] = "cursor" # change style to cursor 

    return [terminal]

get_terminal = (inc_map, fov) ->
    #console.log("Terminal...")
    #console.log inc_map
    # dummy
    mapa = []
    for x in [0..21]
        mapa.push []
        for y in [0..21]
            mapa[x].push ["&nbsp;", [255,255,255], "normal"]

    #mapa = ((["&nbsp;", [255,255,255]] for num in [0..21]) for num in [0..21])

    # draw map
    x_max = (inc_map.length-1)
    y_max = (inc_map[0].length-1)
    for x in [0..x_max]
        for y in [0..y_max]
            if fov[x][y] == 1 # visible
                #console.log TileTypes.data[inc_map[x][y]].map_str
                mapa[x][y] = [ TileTypes.data[inc_map[x][y]].map_str, [255,255, 255], "normal" ]
            # debug
            else if State.explored[x][y] == 1
                mapa[x][y] = [ TileTypes.data[inc_map[x][y]].map_str, [255, 255, 255], "explored" ]

    #console.log(mapa)

    return mapa

get_messages = ->
    drawn = null
    if State.messages.length < 5
        drawn = State.messages
    else
        #slicing
        drawn = State.messages.slice(-5)

    return drawn 

#get_terminal()

export { get_terminal, redraw_terminal, get_messages }