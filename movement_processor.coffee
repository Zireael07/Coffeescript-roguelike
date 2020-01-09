import {Position, Velocity } from './components.js'

import {TileTypes } from './enums.js'
import { State } from './js_game_vars.js';

class MovementProcessor
    # constructor ->
    #     @world = undefined
    ```
    constructor() {
      this.world = undefined;
    }
    ```

    process: ->
        # destructuring assignment
        for [ent, comps] in @world.get_components(Velocity, Position)
            #console.log "Components: " + comps
            [vel, pos] = comps
            #console.log "Vel: " + vel.dx  + " " + vel.dy + " pos: " + pos
            if vel.dx == 0 and vel.dy == 0
                # skip entity
                continue
                
            tx = pos.x + vel.dx
            ty = pos.y + vel.dy
            #console.log "x: " + pos.x + " y: " + pos.y

            vel.dx = 0
            vel.dy = 0

             # don't walk out of map
            if tx < 0 or tx > 19 or ty < 0 or tx > 19
                continue

            # check for unwalkable tiles
            if TileTypes.data[State.map[tx][ty]].block_path
                continue

            pos.x = tx
            pos.y = ty

            return # avoid implicit return

export { MovementProcessor }