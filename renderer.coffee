import {TileTypes } from './enums.js'

# console is a reserved name in JS
redraw_terminal = (position, inc_map, fov) ->
    terminal = get_terminal(inc_map, fov)
    # draw player
    terminal[position.x][position.y] = ['@', [255, 255, 255]]

    return [terminal]

get_terminal = (inc_map, fov) ->
    #console.log("Terminal...")
    #console.log inc_map
    # dummy
    mapa = []
    for x in [0..21]
        mapa.push []
        for y in [0..21]
            mapa[x].push ["&nbsp;", [255,255,255]]

    #mapa = ((["&nbsp;", [255,255,255]] for num in [0..21]) for num in [0..21])

    # draw map
    x_max = (inc_map.length-1)
    y_max = (inc_map[0].length-1)
    for x in [0..x_max]
        for y in [0..y_max]
            if fov[x][y] == 1 # visible
                #console.log TileTypes.data[inc_map[x][y]].map_str
                mapa[x][y] = [ TileTypes.data[inc_map[x][y]].map_str, [255,255, 255] ]

    #console.log(mapa)

    return mapa


#get_terminal()

export { get_terminal, redraw_terminal }