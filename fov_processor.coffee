import {Player, Position } from './components.js'

import { PermissiveFov } from './ppfov/index.js';

import {TileTypes } from './enums.js';
import { State } from './js_game_vars.js';


# FOV interface

explore = (x,y) ->
    State.fov[x][y] = 1
    return 

block_sight = (x,y) ->
    return TileTypes.data[State.map[x][y]].block_path

transparent = (x,y) ->
    return !block_sight(x,y)

init_FOV = ->
    fov = []
    for x in [0..20]
        fov.push []
        for y in [0..20]
            fov[x].push [0]

    return fov

update_FOV = (src_x, src_y, fov_ob) ->

    # Generate FOV
    #game_vars.fov = [[0 for _ in range(constants.MAP_HEIGHT)] for _ in range(constants.MAP_WIDTH)]
    # Clear
    State.fov = []
    for x in [0..20]
         State.fov.push []
         for y in [0..20]
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
        for [ent, comps] in @world.get_components(Player, Position)
            [player, pos] = comps

            #print("FOV process pos " + str(pos.x) + " " + str(pos.y))
            update_FOV(pos.x, pos.y, this.fov_ob)


export { FovProcessor, init_FOV, explore, block_sight, transparent, update_FOV }