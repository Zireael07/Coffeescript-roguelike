import { NPC, Player, TurnComponent } from './components.js'


class AIProcessor
    # constructor ->
    #     @world = undefined
    ```
    constructor() {
      this.world = undefined;
    }
    ```

    process: ->
        console.log ("AI processor...")
        # destructuring assignment
        for [ent, comps] in @world.get_components(NPC)
            [brain] = comps

            this.take_turn()

        # player takes the next turn
        player_id = null
        for [ent, comps] in @world.get_components(Player)
            player_id = ent
            
        @world.add_component(player_id, new TurnComponent())
        @world.remove_processor(AIProcessor)

        return # avoid implicit return

    take_turn: ->
        console.log "AI thinks..."

export { AIProcessor }