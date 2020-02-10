import { NPC, Player, TurnComponent, Position, Combat, AIMovement, Faction } from '../components.js'
import { State } from '../js_game_vars.js';
import { findPath } from "../astar.js";
import { TileTypes, Movement } from "../enums.js";
import { get_faction_reaction } from '../game.js';

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

        # do we want to approach the player?
        # TODO: genericize it (evaluate for all NPCs other than self in fov)
        # FOV is symmetric: if we're in FOV, player is in NPC's sights too
        if State.fov[position.x][position.y] == 1
            #console.log("We can see player")

            # check faction
            our_faction = @world.component_for_entity(entity, Faction).faction
            target_faction = @world.component_for_entity(player, Faction).faction

            if our_faction == target_faction
                # same faction, don't attack
                return

            # are we enemies?
            is_enemy_faction = get_faction_reaction(our_faction, target_faction) < 0
            if is_enemy_faction

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

                    
                    return # muzzle default return


        # basic movement (based on RLTK tutorial)
        movement = @world.component_for_entity(entity, AIMovement)
        if movement
            if movement.move == Movement.STATIC
                return # no implicit return

            else if movement.move == Movement.RANDOM
                move_roll = State.rng.roller("1d5")
                x = 0
                y = 0
                if move_roll == 1
                    x = -1
                if move_roll == 2
                    x = 1
                if move_roll == 3 
                    y = -1
                if move_roll == 4
                    y = 1
                # else nothing
                
                tx = position.x + x
                ty = position.y + y
                #console.log("AI wants to move to " + tx + " " + ty)
                if tx > 0 && tx < State.map.length && ty > 0 && ty < State.map[0].length
                    # check for unwalkable tiles
                    unless TileTypes.data[State.map[tx][ty]].block_path
                        # move
                        [position.x, position.y ] = [ tx, ty]


export { AIProcessor }