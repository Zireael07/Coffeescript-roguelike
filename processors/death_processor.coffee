import { Name, Dead, Player, Position, Equipped } from '../components.js'
import { State } from '../js_game_vars.js';

class DeathProcessor
    # constructor ->
    #     @world = undefined
    #     @action = null
    ```
    constructor() {
      this.world = undefined
    }
    ```

    process: ->
        #console.log ("Death processor...")
        for [ent, comps] in @world.get_components(Name, Dead, Position)
            #console.log "Dead... " + ent
            [name, dead, pos] = comps
            if @world.component_for_entity(ent, Player)
                State.messages.push (["You are DEAD!", [255,0,0]])
                # skip
                continue
            
            # drop their stuff
            for [item_ent, equip] in @world.get_component(Equipped)
                #console.log(item_ent)
                if equip.owner == ent
                    #console.log(item_ent)
                    # drop
                    @world.remove_component(item_ent, Equipped)

                    pos_item = @world.component_for_entity(item_ent, Position)
                    pos_item.x = pos.x
                    pos_item.y = pos.y

            State.messages.push [name.name + " is dead!", [127,127,127]]
            # delete from ECS
            @world.delete_entity(ent)

        return # avoid coffeescript's implicit return

export { DeathProcessor }