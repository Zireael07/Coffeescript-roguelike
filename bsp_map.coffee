import { TileTypes } from './enums.js';
import { Rect } from './map_common.js';
import { split_container } from './bsp.js';
import { State } from './js_game_vars.js';
import { remove_list } from './intersection.js'

paint = (tree, mapa) ->
    #room_func(tree.leaf, mapa)
    if tree.lchild != undefined
        room_func(tree.lchild.leaf, mapa)
    if tree.rchild != undefined
        room_func(tree.rchild.leaf, mapa)

    return # throttle default ret

room_func = (room, mapa) ->
    #console.log(room)
    #console.log(mapa)
    # set all tiles within a rectangle to wall
    x_min = room.x1+1
    y_min = room.y1+1
    x_max = room.x2-1
    y_max = room.y2-1
    for x in [x_min..x_max]
        for y in [y_min..y_max]
            mapa[x][y] = TileTypes.WALL

    # Build Interior
    x_min2 = room.x1+2
    x_max2 = room.x2-2
    y_min2 = room.y1+2
    y_max2 = room.y2-2
    # this is inclusive
    for x in [x_min2..x_max2]
        for y in [y_min2..y_max2]
            mapa[x][y] = TileTypes.FLOOR_INDOOR

    return # throttle default ret


map_create = (level=null, max_x=20, max_y=20) ->
    #new_map = [[ get_index(TileTypes.FLOOR) for _ in range(0, constants.MAP_HEIGHT)] for _ in range(0, constants.MAP_WIDTH)]
    
    if level == null
        level = new Level(new_map)

        start_x = 0
        start_y = 0 
        end_x = max_x-1
        end_y = max_y-1

        # those are inclusive
        for x in [start_x..end_x]
            new_map.push []
            for y in [start_y..end_y]
                new_map[x].push [TileTypes.FLOOR ]

        level.mapa = new_map

    # if level has submaps, we only act within submaps borders
    if level != null && level.submaps.length > 0
        start_x = level.submaps[0].x1
        end_x = level.submaps[0].x2
        start_y = level.submaps[0].y1
        end_y = level.submaps[0].y2

        for x in [start_x..end_x]
            for y in [start_y..end_y]
               level.mapa[x][y] = TileTypes.FLOOR
    

    # basic bsp
    main_container = new Rect(start_x, start_y, end_x-start_x, end_y-start_y)
    #console.log("main: ")
    #console.log(main_container)
    container_tree = split_container(main_container, 2, true)

    paint(container_tree, level.mapa)

    console.log(level.mapa)

    create_doors(container_tree, level.mapa)

    return level


create_doors = (tree, mapa) ->
    #room_doors(tree.leaf, mapa)
    if tree.lchild != undefined
        room_doors(tree.lchild.leaf, mapa)
    if tree.rchild != undefined
        room_doors(tree.rchild.leaf, mapa)

room_doors = (room, mapa) ->
    [x, y] = room.center()
    console.log("Creating door for " + x + " " + y)
    console.log(mapa)

    choices = ["north", "south", "east", "west"]

    # copy the list so that we don't modify it while iterating (caused some directions to be missed)
    sel_choices = choices.slice(0)

    # check if the door leads anywhere
    for choice in choices
        #print(str(choice)+"...")
        if choice == "north"
            checkX = x
            checkY = (room.y1)

        if choice == "south"
            checkX = x
            checkY = (room.y2-1)

        if choice == "east"
            checkX = (room.x2-1)
            checkY = y

        if choice == "west"
            checkX = (room.x1)
            checkY = y

        # if it leads to a wall, remove it from list of choices
        #print("Checking dir " + str(choice) + ": x:" + str(checkX) + " y:" + str(checkY) + " " + str(self._map[checkX][checkY]))

        if mapa[checkX][checkY] == TileTypes.WALL or mapa[checkX][checkY] == TileTypes.TREE
            #print("Removing direction from list" + str(choice))
            sel_choices = remove_list(sel_choices, choice)

    #print("Choices: " + str(sel_choices))
    if sel_choices.length > 0
        wall = State.rng.getItem(sel_choices)

        #console.log("wall: " + wall)
        if wall == "north"
            wallX = x
            wallY = (room.y1+1)

        else if wall == "south"
            wallX = x
            wallY = (room.y2-1)

        else if wall == "east"
            wallX = (room.x2-1)
            wallY = y

        else if wall == "west"
            wallX = (room.x1+1)
            wallY = y

        mapa[wallX][wallY] = TileTypes.FLOOR


export { map_create }