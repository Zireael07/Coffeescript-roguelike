import { TileTypes } from './enums.js'

map_create = (pillars) ->
    #new_map = [[ get_index(TileTypes.FLOOR) for _ in range(0, constants.MAP_HEIGHT)] for _ in range(0, constants.MAP_WIDTH)]
    new_map = []
    for x in [0..20]
        new_map.push []
        for y in [0..20]
            new_map[x].push [TileTypes.FLOOR ]


    for coords in pillars
        new_map[coords[0]][coords[1]] = TileTypes.WALL #.block_path = True

    # walls around the map
    for x in [0..20]
        new_map[x][0] = TileTypes.WALL #.block_path = True
        new_map[x][19] = TileTypes.WALL #.block_path = True

    for y in [0..20]
        new_map[0][y] = TileTypes.WALL #.block_path = True
        new_map[19][y] = TileTypes.WALL #.block_path = True

    return new_map

export { map_create }