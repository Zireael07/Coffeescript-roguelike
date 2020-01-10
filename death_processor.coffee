import { Name, Dead, Player } from './components.js'
import { State } from './js_game_vars.js';

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
        for [ent, comps] in @world.get_components(Name, Dead)
            #console.log "Dead... " + ent
            [name, dead] = comps
            if @world.component_for_entity(ent, Player)
                State.messages.push ("You are DEAD!")
                # skip
                continue
            
            State.messages.push name.name + " is dead!"
            # delete from ECS
            @world.delete_entity(ent)

        return # avoid coffeescript's implicit return

export { DeathProcessor }