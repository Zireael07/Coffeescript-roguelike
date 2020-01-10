import { TurnComponent, Velocity } from './components.js'
import { AIProcessor } from './ai_processor.js'

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

        for [ent, turn] in @world.get_component(TurnComponent)
            if _move
                [dx, dy] = _move
                @world.add_component(ent, new Velocity(dx, dy))


            # no longer our turn, AI now acts
            @world.remove_component(ent, TurnComponent)
            #@world.add_and_run_processor(new AIProcessor())
            #console.log @world.processors
            
            return # avoid coffeescript's implicit return

export { ActionProcessor }