import { NPC, Player, TurnComponent, Position, Combat } from '../components.js'
import { State } from '../js_game_vars.js';
import { findPath } from "../astar.js"

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

        player_id = null
        for [ent, comps] in @world.get_components(Player)
            player_id = ent

        unless @world.component_for_entity(player_id, TurnComponent)
            # destructuring assignment
            for [ent, comps] in @world.get_components(NPC)
                [brain] = comps

                this.take_turn(ent, player_id)

            # player takes the next turn
            @world.add_component(player_id, new TurnComponent())
            #@world.remove_processor(AIProcessor)

        return # avoid implicit return

    take_turn: (entity, player) ->
        #console.log "AI thinks..."
        position = @world.component_for_entity(entity, Position)
        player_pos = @world.component_for_entity(player, Position)

        # FOV is symmetric: if we're in FOV, player is in NPC's sights too
        if State.fov[position.x][position.y] == 1
            #console.log("We can see player")

            # pathfind
            path = findPath(State.map, [position.x, position.y], [player_pos.x, player_pos.y]);
            console.log("Path: " + path)

            # #0 is our current position
            if path.length > 1
                #console.log "Next path: " + path[1]
                #console.log "Player pos: " + [player_pos.x, player_pos.y]
                #console.log ((path[1][0] != player_pos.x) and (path[1][1] != player_pos.y))
                unless ((path[1][0] == player_pos.x) and (path[1][1] == player_pos.y))
                    # just move (the path only works on walkable tiles anyway)
                    [position.x, position.y] = path[1]
                else
                    #console.log("AI kicks at your shins")
                    # Trigger a bump attack here
                    console.log("Attacking " + player + " @ " + player_pos)
                    @world.add_component(entity, new Combat(player))

export { AIProcessor }