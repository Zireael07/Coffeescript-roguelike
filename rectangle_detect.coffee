import { Directions, TileTypes } from './enums.js';
import { Rect } from './map_common.js';

import { max_rectangle_histogram } from './max_rectangle_hist.js';

# step one of finding rectangle of floor in matrix
# https://stackoverflow.com/a/12387148
num_unbroken_floors_columns = (inc_map) ->
    #num_floors = [[0 for _ in range(len(inc_map[0]))] for _ in range(len(inc_map))]
    num_floors = []
    for x in [0..inc_map.length]
        num_floors.push []
        for y in [0..inc_map[0].length]
            num_floors[x].push 0

    #console.log(num_floors)

    #console.log("North: " + Directions.NORTH)

    for x in [0..inc_map.length-1] # width
        for y in [0..inc_map[0].length-1] #height
            # paranoia
            north = [x + Directions.NORTH[0], y + Directions.NORTH[1]]
            add = if y == 0 then 0 else num_floors[north[0]][north[1]]
            
            #console.log("North: " + north)
            

            num_floors[x][y] = if inc_map[x][y] == TileTypes.FLOOR then 1 + add else 0

    return num_floors

# parse it nicely
unbroken_floors_columns_get = (num_floors) ->
    floors = []
    for y in [0..num_floors.length-1]
        row = []
        for x in [0..num_floors[0].length-1]
            row.push(num_floors[x][y])

        floors.push(row)

    return floors


sort_fun = (a,b) ->
    return a-b

# step two of finding rectangle of floor in matrix
# https://stackoverflow.com/a/12387148
largest_area_rects = (floors) ->
    rects = []
    # reverse order
    y_min = floors.length-2
    for y in [y_min..0]
        #console.log("Index: " + y)
        #console.log(floors[y])

        rect = max_rectangle_histogram(floors[y], y)

        rects.push rect

    # this sorts in descending order
    sorted = rects.sort(sort_fun)
    #console.log sorted
    # .. so we need the first entry
    return sorted[0]


run_rectangle_detection = (mapa) ->
    floors = num_unbroken_floors_columns(mapa)

    # get tidy rows from the floors 2d array
    row_floors = unbroken_floors_columns_get(floors)
    #print(row_floors)

    largest = largest_area_rects(row_floors)

    big_rect = largest[1]
    index = largest[2]
    w = big_rect.x2 - big_rect.x1
    h = big_rect.y2 - big_rect.y1

    console.log("Largest: " + "index: " + index + " x " + big_rect.x1 + ",y " + big_rect.y1 +
            " w: " + w + " h: " + h)
    # " to x: " + str(big_rect.x2) + ",y: " + str(big_rect.y2))

    return big_rect


debug_rect = (rect, mapa) ->
    console.log(rect)
    for x in [rect.x1..rect.x2]
        for y in [rect.y1..rect.y2]
            mapa[x][y] = TileTypes.DEBUG

export { run_rectangle_detection, debug_rect }