import { Position, InBackpack, Item, WantToPickup, Name } from '../components.js'
import { State } from '../js_game_vars.js';

class PickupProcessor
    # constructor ->
    #     @world = undefined
    #     @action = null
    ```
    constructor() {
      this.world = undefined
    }
    ```

    process: ->
        for [ent, comps] in @world.get_components(WantToPickup, Position)
          [pick, pos] = comps
          for [item_ent, item_comps] in @world.get_components(Item, Position)
            [item, item_pos] = item_comps
            if pos.x == item_pos.x && pos.y == item_pos.y
              unless @world.component_for_entity(item_ent, InBackpack)
                @world.add_component(item_ent, new InBackpack())
                item_name = @world.component_for_entity(item_ent, Name)
                State.messages.push ["Player picked up " + item_name.name + "!", [255,255,255]]
                break # only pick up one item

          @world.remove_component(ent, WantToPickup)
        return # avoid coffeescript's implicit return

export { PickupProcessor }