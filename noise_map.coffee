import { Simplex } from './3rd-party/rotjs/simplex.js';
import { TileTypes } from './enums.js';

map_create = () ->
    #new_map = [[ get_index(TileTypes.FLOOR) for _ in range(0, constants.MAP_HEIGHT)] for _ in range(0, constants.MAP_WIDTH)]
    new_map = []
    for x in [0..20]
        new_map.push []
        for y in [0..20]
            new_map[x].push [TileTypes.FLOOR ]

    # basic noise
    noise = new Simplex()

    # create the map
    for x in [0..20]
        for y in [0..20]

            i = x
            j = y
            n = noise.get(i/20, j/20) *255 # because default values are very small
            #console.log "noise: " + n 

            if n >= 0
                new_map[x][y] = TileTypes.WALL
            else
                new_map[x][y] = TileTypes.FLOOR

    return new_map

export { map_create }