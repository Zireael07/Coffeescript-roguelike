import {TileTypes } from './enums.js';
import { State } from './js_game_vars.js';

get_free_tiles = (inc_map) ->
    free_tiles = []
    max_y = inc_map[0].length-1
    max_x = inc_map.length-1
    for y in [0..max_y]
        for x in [0..max_x]
            unless TileTypes.data[inc_map[x][y]].block_path
                free_tiles.push([x,y])
    return free_tiles

random_free_tile = (inc_map) -> 
    free_tiles = get_free_tiles(inc_map)

    index = State.rng.range(0, free_tiles.length-1)

    #console.log("Index is " + index)

    x = free_tiles[index][0]
    y = free_tiles[index][1]

    console.log("Coordinates are " + x + " " + y)

    tile = [x,y]
    return tile


tiles_distance_to = (start, target) ->
    x_diff = start[0] - target[0]
    y_diff = start[1] - target[1]

    ##ensure always positive values
    if x_diff < 0
        x_diff = x_diff * -1

    if y_diff < 0
        y_diff = y_diff * -1

    return Math.max(x_diff, y_diff)

export { tiles_distance_to, random_free_tile }