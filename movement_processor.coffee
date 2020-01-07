# import { get_components } from './ecs.js'

import {Position, Velocity } from './components.js'

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
            #console.log "Vel: " + vel + " pos: " + pos
            pos.x += vel.dx
            pos.y += vel.dy
            #console.log "x: " + pos.x + " y: " + pos.y

            vel.dx = 0
            vel.dy = 0
            return # avoid implicit return

export { MovementProcessor }