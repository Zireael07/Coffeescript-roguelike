import {Combat, Stats } from './components.js'

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
            
        
        return # avoid coffeescript's implicit return

export { CombatProcessor }