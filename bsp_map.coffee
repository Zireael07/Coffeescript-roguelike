import { TileTypes } from './enums.js';
import { Rect } from './map_common.js';
import { split_container } from './bsp.js';

paint = (tree, mapa) ->
    room_func(tree.leaf, mapa)
    if tree.lchild != undefined
        room_func(tree.lchild.leaf, mapa)
    if tree.rchild != undefined
        room_func(tree.rchild.leaf, mapa)

    return # throttle default ret

room_func = (room, mapa) ->
    console.log(room)
    #console.log(mapa)
    # set all tiles within a rectangle to wall
    x_min = room.x1+1
    y_min = room.y1+1
    for x in [x_min..room.x2]
        for y in [y_min..room.y2]
            mapa[x][y] = TileTypes.WALL

    # Build Interior
    x_min2 = room.x1+2
    x_max2 = room.x2-1
    y_min2 = room.y1+2
    y_max2 = room.y2-1
    for x in [x_min2..x_max2]
        for y in [y_min2..y_max2]
            mapa[x][y] = TileTypes.FLOOR

    return # throttle default ret


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

    # basic bsp
    main_container = new Rect(0, 0, end_x, end_y) # off by one
    container_tree = split_container(main_container, 2, true)

    paint(container_tree, new_map)

    return new_map

export { map_create }