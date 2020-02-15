import {Position, Velocity, TileBlocker, Combat, Pause, Cursor, TurnComponent,
Door, VisibilityBlocker, Renderable, Lock } from '../components.js'

import {TileTypes } from '../enums.js'
import { State } from '../js_game_vars.js';

import {show_codepad } from '../keypad.js';

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
                    if @world.component_for_entity(ent_target, Lock)
                        # can't go through, message 
                        #State.messages.push [ "This is protected by a lock", [255,255,255] ]

                        show_codepad(ent_target);
                        # cancel the move
                        tx = pos.x
                        ty = pos.y
                        # stays our turn
                        @world.add_component(ent, new Pause())
                        continue

                    if @world.component_for_entity(ent_target, Door)
                        # open, unblock visibility and movement
                        @world.component_for_entity(ent_target, Door).open = true
                        @world.remove_component(ent_target, TileBlocker)
                        @world.remove_component(ent_target, VisibilityBlocker)
                        # change glyph
                        @world.component_for_entity(ent_target, Renderable).char = "±"
                    else
                        # Trigger a bump attack here
                        console.log("Attacking " + ent_target + " @ " + pos_tg)
                        @world.add_component(ent, new Combat(ent_target))

            # move (if no combat going on)
            #console.log @world.component_for_entity(ent, Combat)
            unless @world.component_for_entity(ent, Combat)
                console.log ("move...")
                pos.x = tx
                pos.y = ty

        # the next processor is AI so remove the turn component
        # no longer our turn, AI now acts
        unless (@world.component_for_entity(ent, Pause) or @world.component_for_entity(ent, Cursor))
            console.log("Removing turn component...")
            @world.remove_component(ent, TurnComponent)

        return # avoid implicit return

export { MovementProcessor }