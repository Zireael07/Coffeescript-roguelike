import { WantToDrop, Position, InBackpack, Name } from '../components.js'
import { State } from '../js_game_vars.js';

class DropProcessor
    # constructor ->
    #     @world = undefined
    #     @action = null
    ```
    constructor() {
      this.world = undefined
    }
    ```

    process: ->
        #console.log("Drop processor")
        for [ent, comps] in @world.get_components(Position, WantToDrop)
            [pos, want] = comps
            item_id = want.item_id

            @world.remove_component(item_id, InBackpack)

            # message
            name = @world.component_for_entity(ent, Name)
            item_name = @world.component_for_entity(item_id, Name)

            # if equipped, unequip
            if @world.component_for_entity(item_id, Equipped)
              @world.remove_component(item_id, Equipped)
              State.messages.push [ name.name + " unequips " + item_name.name, [255,255,255] ]

            pos_item = @world.component_for_entity(item_id, Position)
            pos_item.x = pos.x
            pos_item.y = pos.y

            State.messages.push [name.name + " drops " + item_name.name + "!", [255,255,255]]

            # cleanup
            @world.remove_component(ent, WantToDrop)
            

        
        return # avoid coffeescript's implicit return

export { DropProcessor }