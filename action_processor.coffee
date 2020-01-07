#import { get_component } from './ecs.js'

import { Velocity } from './components.js'

class ActionProcessor
    # constructor ->
    #     @world = undefined
    #     @action = null
    ```
    constructor() {
      this.world = undefined
      this.action = null
    }
    ```

    process: ->
        # Assign the appropriate component.
        # For example, for action == {'move': (0, -1)}, set the vel.dx and vel.dy.

        _move = @action['move']

        for [ent, vel] in @world.get_component(Velocity)
            if _move
                [dx, dy] = _move
                vel.dx = dx
                vel.dy = dy
                return # avoid coffeescript's implicit return

export { ActionProcessor }