import { TileTypes } from './enums.js';
import { Rect } from './map_common.js';
import { Tree } from './bsp.js';
import { State } from './js_game_vars.js';
import { remove_list } from './intersection.js'

building_tag = { 1: "PUB", 2: "HOVEL", 3: "UNASSIGNED" }


paint_leaf = (leaf, tree, level) ->
    if (leaf.lchild != undefined) or (leaf.rchild != undefined)
        # recursively search for children until you hit the end of the branch
        if (leaf.lchild)
            paint_leaf(leaf.lchild, tree, level)
        if (leaf.rchild)
            paint_leaf(leaf.rchild, tree, level)
    else
        # Create rooms in the end branches of the bsp tree
        level.rooms.push leaf.leaf


        room_func(leaf.leaf, level.mapa)

paint = (tree, level) ->
    #for l in tree.leafs
    paint_leaf(tree.rootLeaf, tree, level)

        #room_func(tree.leaf, mapa)
        #if l.lchild != undefined
        #    room_func(l.lchild.leaf, mapa)
        #if l.rchild != undefined
        #    room_func(l.rchild.leaf, mapa)

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
    bsp_tree = new Tree(new Rect(start_x, start_y, end_x-start_x, end_y-start_y))
    #console.log("tree: ")
    console.log(bsp_tree)
    bsp_tree.split_tree()

    paint(bsp_tree, level)

    #console.log(level.mapa)

    create_doors(bsp_tree, level)

    building_size = sort_buildings(level.rooms)
    building_factory(level, building_size)

    return level

# descending order
sort_fun = (a,b) ->
    return b[1]-a[1]

make_hovel = (sorted, i, max) ->
    if i > 0 and i < max
        sorted[i][2] = 2
        console.log(i + " is hovel")

sort_buildings = (rooms) ->
    building_size = []
    # 3 means unassigned (see beginning of file)
    building_size.push [i, r.w*r.h, 3, r] for r, i in rooms
    sorted = building_size.sort(sort_fun)
    # biggest is pub
    sorted[0][2] = 1
    # others are hovels
    make_hovel(sorted, i, sorted.length-1) for s, i in sorted
    console.log sorted 
    return sorted

call_building_fun = (i, sized, level) ->
    if sized[i][2] == 1
        build_pub(sized[i][3], level)

building_factory = (level, building_size) ->
    call_building_fun(i, building_size, level) for building, i in building_size


build_pub = (room, level) ->
    to_place_props = ["table", "chair", "table", "chair"]
    to_place_npcs = [ "barkeep", 'shady', "patron", "patron"]
    # keep the building's outskirts empty
    x_min = room.x1+3
    x_max = room.x2-3
    y_min = room.y1+3
    y_max = room.y2-3
    # this is inclusive
    for x in [x_min..x_max]
        for y in [y_min..y_max]
            if to_place_props.length > 0 && State.rng.roller("1d3") == 1
                level.spawns.push [[x,y], [to_place_props[0], "prop"] ]
                to_place_props = remove_list(to_place_props, to_place_props[0])
            
            if to_place_npcs.length > 0 && State.rng.roller("1d3") == 2
                level.spawns.push [[x,y], [to_place_npcs[0], "npc"] ]
                to_place_npcs = remove_list(to_place_npcs, to_place_npcs[0])


# doors
find_rooms = (leaf, tree, level) ->
    if (leaf.lchild != undefined) or (leaf.rchild != undefined)
        # recursively search for children until you hit the end of the branch
        if (leaf.lchild)
            find_rooms(leaf.lchild, tree, level)
        if (leaf.rchild)
            find_rooms(leaf.rchild, tree, level)
    else
        # Create rooms in the end branches of the bsp tree
        room_doors(leaf.leaf, level)

create_doors = (tree, level) ->
    #for l in tree.leafs
    find_rooms(tree.rootLeaf, tree, level)

        #room_doors(tree.leaf, mapa)
        # if l.lchild != undefined
        #     room_doors(l.lchild.leaf, mapa)
        # if l.rchild != undefined
        #     room_doors(l.rchild.leaf, mapa)


room_doors = (room, level) ->
    [x, y] = room.center()
    console.log("Creating door for " + x + " " + y)
    #console.log(mapa)

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

        if level.mapa[checkX][checkY] == TileTypes.WALL or level.mapa[checkX][checkY] == TileTypes.TREE
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

        level.mapa[wallX][wallY] = TileTypes.FLOOR
        # spawn the prop
        level.spawns.push [[wallX, wallY], ["door", "prop"] ]


export { map_create }