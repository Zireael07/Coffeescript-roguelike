import {Player, Position, VisibilityBlocker } from '../components.js'

import { PermissiveFov } from '../3rd-party/ppfov/index.js';

import {TileTypes } from '../enums.js';
import { State } from '../js_game_vars.js';


# FOV interface

explore = (x,y) ->
    State.fov[x][y] = 1
    State.explored[x][y] = 1
    #console.log State.explored[x][y]
    return 

block_sight = (x,y) ->
    return TileTypes.data[State.map[x][y]].block_path

block_vis = (x,y) ->
    ret = false
    for [ent, comps] in State.world.get_components(Position, VisibilityBlocker)
        [pos, block] = comps
        #console.log "Visibility blocker " + ent + " x: " + pos.x + " , y " + pos.y
        if x == pos.x && y == pos.y
            #console.log("Block vis true")
            return true

transparent = (x,y) ->
    if !block_sight(x,y) == false
        return !block_sight(x,y)
    else
        if !block_vis(x,y)
            return !block_vis(x,y)

    #return !block_sight(x,y)

init_FOV = (fov_ob) ->
    fov = []
    for x in [0..fov_ob.mapWidth]
        fov.push []
        for y in [0..fov_ob.mapHeight]
            fov[x].push [0]

    return fov

init_explored = (fov_ob) ->
    explored = []
    for x in [0..fov_ob.mapWidth]
        explored.push []
        for y in [0..fov_ob.mapHeight]
            explored[x].push [0]

    return explored

update_FOV = (src_x, src_y, fov_ob) ->

    # Generate FOV
    #game_vars.fov = [[0 for _ in range(constants.MAP_HEIGHT)] for _ in range(constants.MAP_WIDTH)]
    # Clear
    State.fov = []
    for x in [0..fov_ob.mapWidth]
         State.fov.push []
         for y in [0..fov_ob.mapHeight]
             State.fov[x].push [0]

    fov_ob.compute(src_x, src_y, 6, explore)
    return 

class FovProcessor
    ```
    constructor(fov_ob) {
      this.world = undefined;
      this.fov_ob = fov_ob;
    }
    ```

    process: ->
        #console.log("FOV processor...")
        for [ent, comps] in @world.get_components(Player, Position)
            [player, pos] = comps

            #print("FOV process pos " + str(pos.x) + " " + str(pos.y))
            update_FOV(pos.x, pos.y, this.fov_ob)


export { FovProcessor, init_FOV, init_explored, explore, block_sight, transparent, update_FOV }