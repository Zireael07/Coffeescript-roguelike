import { WantToUseItem, MedItem, Stats, Name, Skip } from './components.js'
import { State } from './js_game_vars.js';

class UseItemProcessor
    # constructor ->
    #     @world = undefined
    #     @action = null
    ```
    constructor() {
      this.world = undefined
    }
    ```

    process: ->
        for [ent, want] in @world.get_component(WantToUseItem)
            item_id = want.item_id

            # if item is a med item
            if @world.component_for_entity(item_id, MedItem)
                value = @world.component_for_entity(item_id, MedItem).heal
                user_stats = @world.component_for_entity(ent, Stats)
                # heal
                user_stats.hp += value
                if user_stats.hp > user_stats.max_hp
                    user_stats.hp = user_stats.max_hp

                # message
                name = @world.component_for_entity(ent, Name)
                item_name = @world.component_for_entity(item_id, Name)

                State.messages.push [name.name + " uses " + item_name.name + ", healing " + value + " hp!", [0,255,0]]

                # cleanup
                @world.add_component(item_id, new Skip()) # using it to mark item as being removed
                @world.delete_entity(item_id)

            # cleanup
            @world.remove_component(ent, WantToUseItem)
            

        
        return # avoid coffeescript's implicit return

export { UseItemProcessor }