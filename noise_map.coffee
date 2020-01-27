import { Simplex } from './3rd-party/rotjs/simplex.js';
import { TileTypes } from './enums.js';
import { Level } from './level.js';

map_create = (max_x=20, max_y=20) ->
    #new_map = [[ get_index(TileTypes.FLOOR) for _ in range(0, constants.MAP_HEIGHT)] for _ in range(0, constants.MAP_WIDTH)]

    end_x = max_x-1
    end_y = max_y-1
    new_map = []
    # those are inclusive
    for x in [0..end_x]
        new_map.push []
        for y in [0..end_y]
            new_map[x].push [TileTypes.FLOOR ]

    level = new Level(new_map)

    # basic noise
    noise = new Simplex()

    # create the map
    for x in [0..end_x]
        for y in [0..end_y]

            i = x
            j = y
            n = noise.get(i/end_x, j/end_y) *255 # because default values are very small
            #console.log "noise: " + n 

            if n >= 0
                new_map[x][y] = TileTypes.TREE
            else
                new_map[x][y] = TileTypes.FLOOR

    level.mapa = new_map
    return level # for chaining
    
export { map_create }