import { TurnComponent, Velocity, WantToPickup, WantToUseItem, WantToDrop } from './components.js'
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
        _pick_up = @action['pick_up']
        _use_item = @action['use_item']
        _drop_item = @action['drop_item']

        for [ent, turn] in @world.get_component(TurnComponent)
            if _move
                [dx, dy] = _move
                @world.add_component(ent, new Velocity(dx, dy))
            if _pick_up
                @world.add_component(ent, new WantToPickup())
                console.log("Pickup to execute...")
            if _use_item
                @world.add_component(ent, new WantToUseItem(_use_item))
                console.log("Use to execute... " + _use_item)
            if _drop_item
                @world.add_component(ent, new WantToDrop(_drop_item))
                console.log("Drop to execute... " + _drop_item)


            # no longer our turn, AI now acts
            @world.remove_component(ent, TurnComponent)
            #@world.add_and_run_processor(new AIProcessor())
            #console.log @world.processors
            
            return # avoid coffeescript's implicit return

export { ActionProcessor }