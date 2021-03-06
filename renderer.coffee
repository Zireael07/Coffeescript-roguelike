import {TileTypes } from './enums.js'
import { State } from './js_game_vars.js';
import { drawn_wall_glyph } from './map_common.js';
import { get_faction_reaction } from './game.js';

import {Position, Renderable, Dead, InBackpack, Equipped, Skip, Player, Cursor, Faction, Name } from './components.js'

render_order_sort = (a,b) ->
    return a[1][1].render_order-b[1][1].render_order

# console is a reserved name in JS
redraw_terminal = (position, inc_map, fov) ->
    terminal = get_terminal(inc_map, fov)

    player_ent = null
    for [ent, player] in State.world.get_component(Player)
        player_ent = ent

    # camera
    cam = State.camera
    width_start = cam.get_width_start()
    width_end = cam.get_width_end(inc_map)
    height_start = cam.get_height_start()
    height_end = cam.get_height_end(inc_map)

    # render order
    to_draw = State.world.get_components(Position, Renderable)
    # ascending order
    matches = to_draw.sort(render_order_sort)

    # draw other entities
    for [ent, comps] in matches
        [pos, visual] = comps

        #console.log visual + " x : " + pos.x + " y :" + pos.y

        # if not in camera view
        if pos.x < width_start or pos.x > width_end or pos.y < height_start or pos.y > height_end
            # skip
            continue

        # if not in fov
        unless fov[pos.x][pos.y] == 1
            # skip
            continue
        # in backpack
        if State.world.component_for_entity(ent, InBackpack)
            # skip
            continue
        if State.world.component_for_entity(ent, Equipped)
            # skip
            continue
        # if dead
        if State.world.component_for_entity(ent, Dead)
            # skip
            continue
        if State.world.component_for_entity(ent, Skip)
            #skip
            continue

        # faction background marker
        # default for e.g. items
        ret = "normal"
        # check faction
        if State.world.component_for_entity(ent, Faction)
            player_f = State.world.component_for_entity(player_ent, Faction).faction
            fact = State.world.component_for_entity(ent, Faction)
            react = get_faction_reaction(player_f, fact.faction)
            #console.log("react: " + react)
        
            if react < -50
                ret = "hostile"
            else if react < 0
                ret = "unfriendly"
            else if react == 0
                ret = "neutral"
            else if react > 50
                ret = "helpful"
            else if react > 0
                ret = "friendly"


        # draw (subtracting camera start to draw in screen space)
        terminal[pos.x-width_start][pos.y-height_start] = [visual.char, visual.color, ["normal", ret] ]

    # draw player
    terminal[position.x-width_start][position.y-height_start] = ['@', [255, 255, 255], ["normal", "friendly"] ]

    # cursor
    cursor = null
    for [ent, comps] in State.world.get_components(Player, Cursor)
        [player, cur] = comps
        cursor = cur

    if cursor != null
        terminal[cursor.x-width_start][cursor.y-height_start][2].push "cursor" # change style to cursor 

    return [terminal]

get_terminal = (inc_map, fov) ->
    #console.log("Terminal...")
    #console.log inc_map
    # dummy
    mapa = []
    for x in [0..21]
        mapa.push []
        for y in [0..21]
            mapa[x].push ["&nbsp;", [255,255,255], ["normal"]]

    #mapa = ((["&nbsp;", [255,255,255]] for num in [0..21]) for num in [0..21])

    # camera
    cam = State.camera
    width_start = cam.get_width_start()
    width_end = cam.get_width_end(inc_map)
    height_start = cam.get_height_start()
    height_end = cam.get_height_end(inc_map)

    # draw map
    # x_max = (inc_map.length-1)
    # y_max = (inc_map[0].length-1)
    # for x in [0..x_max]
    #     for y in [0..y_max]
    #         # if in camera
    #         if x >= width_start and x <= width_end and y >= height_start and y <= height_end
    
    # based on https://bfnightly.bracketproductions.com/rustbook/chapter_41.html
    # x,y are screen coordinates, tx, ty are map (tile) coordinates
    y = 0
    y_max = (height_end+1)
    x_max = (width_end+1)
    for ty in [height_start..y_max]
        x = 0
        for tx in [width_start..width_end+1]
            # if on map
            if tx >= 0 and tx < inc_map.length and ty >= 0 and ty < inc_map[0].length
                glyph = if (inc_map[tx][ty] == TileTypes.WALL) then drawn_wall_glyph(inc_map, tx, ty) else TileTypes.data[inc_map[tx][ty]].map_str
                #console.log("x: " + tx + " y: " + ty + " Wall: " + (inc_map[tx][ty] == TileTypes.WALL))
                #console.log("x: " + tx + " y: " + ty + " glyph: " + glyph)
                if fov[tx][ty] == 1 # visible
                    #console.log TileTypes.data[inc_map[x][y]].map_str
                    mapa[x][y] = [ glyph, TileTypes.data[inc_map[tx][ty]].color, ["normal"] ]
                # explored
                else if State.explored[tx][ty] == 1
                    mapa[x][y] = [ glyph, [] , ["explored"] ]

            x += 1
        y += 1

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

get_look_list = (cursor_pos) ->
    look_list = []

    # items under cursor
    if cursor_pos != null && cursor_pos != undefined

        player_ent = null
        for [ent, player] in State.world.get_component(Player)
            player_ent = ent

        for [ent, comps] in State.world.get_components(Position, Renderable)
            [pos, vis] = comps
            if State.world.component_for_entity(ent, Dead)
                # skip
                continue
            if State.world.component_for_entity(ent, InBackpack)
                # skip
                continue
            if State.world.component_for_entity(ent, Equipped)
                # skip
                continue

            if pos.x == cursor_pos.x && pos.y == cursor_pos.y
                name = State.world.component_for_entity(ent, Name).name

                ret = null
                # check faction
                if State.world.component_for_entity(ent, Faction)
                    player_f = State.world.component_for_entity(player_ent, Faction).faction
                    fact = State.world.component_for_entity(ent, Faction)
                    react = get_faction_reaction(player_f, fact.faction)
                    #console.log("react: " + react)
        
                    if react < -50
                        ret = "hostile"
                    else if react < 0
                        ret = "unfriendly"
                    else if react == 0
                        ret = "neutral"
                    else if react > 50
                        ret = "helpful"
                    else if react > 0
                        ret = "friendly"
            
                look_list.push [name, vis.char, vis.color, ret]

    return look_list

export { get_terminal, redraw_terminal, get_messages, get_look_list }