import { TurnComponent, Velocity, WantToPickup, WantToUseItem, WantToDrop, 
Cursor, Ranged, Position, MedItem, Wearable } from './components.js';
import { AIProcessor } from './ai_processor.js';

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
        _target = @action['target']
        _look = @action['look']

        for [ent, turn] in @world.get_component(TurnComponent)
            if _move
                [dx, dy] = _move
                unless @world.component_for_entity(ent, Cursor)
                    @world.add_component(ent, new Velocity(dx, dy))
                else
                    cur = @world.component_for_entity(ent, Cursor)
                    cur.x = cur.x + dx
                    cur.y = cur.y + dy

            if _pick_up
                @world.add_component(ent, new WantToPickup())
                console.log("Pickup to execute...")
            if _use_item
                console.log("Use to execute... " + _use_item)
                if @world.component_for_entity(_use_item, MedItem)
                    @world.add_component(ent, new WantToUseItem(_use_item))
                if @world.component_for_entity(_use_item, Wearable)
                    @world.add_component(ent, new WantToUseItem(_use_item))
                if @world.component_for_entity(_use_item, Ranged)
                    pos = @world.component_for_entity(ent, Position)
                    @world.add_component(ent, new Cursor(pos.x, pos.y, _use_item))
                
            if _drop_item
                @world.add_component(ent, new WantToDrop(_drop_item))
                console.log("Drop to execute... " + _drop_item)
            if _target
                console.log("Target to execute...")
                unless @world.component_for_entity(ent, Cursor)
                    # clicked by mistake, ignore
                else     
                    cur = @world.component_for_entity(ent, Cursor)
                    console.log("Confirmed target x: " + cur.x + " y: " + cur.y)
                    if cur.item != null
                        @world.add_component(ent, new WantToUseItem(cur.item))
            if _look
                console.log("Look to execute...")
                unless @world.component_for_entity(ent, Cursor)
                    pos = @world.component_for_entity(ent, Position)
                    @world.add_component(ent, new Cursor(pos.x, pos.y, null))
                else
                    # toggle it off
                    @world.remove_component(ent, Cursor)

            unless @world.component_for_entity(ent, Cursor)
                # no longer our turn, AI now acts
                @world.remove_component(ent, TurnComponent)
            #@world.add_and_run_processor(new AIProcessor())
            #console.log @world.processors
            
            return # avoid coffeescript's implicit return

export { ActionProcessor }