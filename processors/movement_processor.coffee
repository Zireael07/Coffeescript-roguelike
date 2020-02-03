import {Position, Velocity, TileBlocker, Combat } from '../components.js'

import {TileTypes } from '../enums.js'
import { State } from '../js_game_vars.js';

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
            #console.log "tx: " + tx + " ty: " + ty

            vel.dx = 0
            vel.dy = 0

             # don't walk out of map
            if tx < 0 or tx > State.map.length or ty < 0 or ty > State.map[0].length
                continue

            # check for unwalkable tiles
            if TileTypes.data[State.map[tx][ty]].block_path
                continue

            # check for entities
            for [ent_target, comps] in @world.get_components(TileBlocker, Position)
                [blocker, pos_tg] = comps
                if pos_tg.x == tx and pos_tg.y == ty
                    # Trigger a bump attack here
                    console.log("Attacking " + ent_target + " @ " + pos_tg)
                    @world.add_component(ent, new Combat(ent_target))

            # move (if no combat going on)
            #console.log @world.component_for_entity(ent, Combat)
            unless @world.component_for_entity(ent, Combat)
                console.log ("move...")
                pos.x = tx
                pos.y = ty

        return # avoid implicit return

export { MovementProcessor }