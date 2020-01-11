import {Combat, Stats, Name, Dead, Player } from './components.js'
import { State } from './js_game_vars.js';

class CombatProcessor
    # constructor ->
    #     @world = undefined
    #     @action = null
    ```
    constructor() {
      this.world = undefined
    }
    ```

    process: ->
        for [ent, combat] in @world.get_component(Combat)
            attacker_id = ent
            target_id = combat.target_id

            attacker_stats = @world.component_for_entity(attacker_id, Stats)
            target_stats = @world.component_for_entity(target_id, Stats)

            # deal damage!
            target_stats.hp -= attacker_stats.power

            # dead
            if target_stats.hp <= 0
                @world.add_component(target_id, new Dead())
                #console.log("Killed target... " + target_id)

            # message
            attacker_name = @world.component_for_entity(attacker_id, Name)
            target_name = @world.component_for_entity(target_id, Name)

            # color
            player_hit = @world.component_for_entity(target_id, Player)
            color = [255,255,255]
            if player_hit
                color = [255,0,0]
            else
                color = [127, 127, 127] # libtcod light gray

            State.messages.push [attacker_name.name + " attacks " + target_name.name + " for " + attacker_stats.power + " damage!", color]

            # cleanup
            @world.remove_component(ent, Combat)
            
        
        return # avoid coffeescript's implicit return

export { CombatProcessor }