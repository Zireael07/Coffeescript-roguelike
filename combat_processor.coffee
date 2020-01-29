import {Combat, Stats, Name, Dead, Player, Faction, Equipped, MeleeBonus, Weapon } from './components.js'
import { State } from './js_game_vars.js';

get_faction_reaction = (faction, target_faction) ->
    console.log("Faction reaction check: " + faction + " " + target_faction)
    for fact in State.factions
        #print(fact)
        if fact[0] == faction and fact[1] == target_faction
            console.log("Faction reaction of " + fact[0] + " to " + fact[1] + " is " + fact[2])
            return fact[2]



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

            attacker_faction = @world.component_for_entity(attacker_id, Faction).faction
            target_faction = @world.component_for_entity(target_id, Faction).faction

            if attacker_faction == target_faction
                # same faction, don't attack
                return

            # are we enemies?
            is_enemy_faction = get_faction_reaction(attacker_faction, target_faction) < 0
            if is_enemy_faction
                console.log("Target faction " + target_faction + " is enemy!")   

                attacker_stats = @world.component_for_entity(attacker_id, Stats)
                target_stats = @world.component_for_entity(target_id, Stats)

                # deal damage!
                #damage = attacker_stats.power

                # if no weapon, deal 1d6
                roll = "1d6"
                # use equipped weapon's data
                for [item_ent, comps] in @world.get_components(Equipped, Weapon)
                    [equipped, weapon] = comps
                    console.log(equipped.slot)
                    if equipped.owner == attacker_id && equipped.slot == "MAIN_HAND"
                        console.log("Use weapon dice")
                        roll = weapon.damage

                # deal damage!
                damage = State.rng.roller(roll)

                # any bonuses?
                for [item_ent, comps] in @world.get_components(Equipped, MeleeBonus)
                    [equipped, bonus] = comps
                    if equipped.owner == attacker_id
                        console.log("Applying melee bonus")
                        damage += bonus.bonus

                target_stats.hp -= damage

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

                State.messages.push [attacker_name.name + " attacks " + target_name.name + " for " + damage + " damage!", color]

            # cleanup
            @world.remove_component(ent, Combat)
            
        
        return # avoid coffeescript's implicit return

export { CombatProcessor }