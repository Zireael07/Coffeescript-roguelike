import {Combat, Stats, Name, Dead, Player, Faction, Skills, Equipped, MeleeBonus, Weapon } from './components.js'
import { State } from './js_game_vars.js';
import { get_faction_reaction } from './game.js';


##Makes a skill test for "skill", where "skill" is a string
skill_test = (skill, ent, world) ->
    sk = world.component_for_entity(ent, Skills)[skill]
    State.messages.push ["Making a test for " + skill + " " + sk, [0, 255, 0]]
    result = State.rng.roller("1d100")
    player = world.component_for_entity(ent, Player)
    if result < sk
        if player
            # check how much we gain in the skill
            tick = State.rng.roller("1d100")

            # roll OVER the current skill
            if tick > world.component_for_entity(ent, Skills)[skill]

                # +1d4 if we succeeded
                gain = State.rng.roller("1d4")
                #setattr(world.component_for_entity(ent, Skills), skill, getattr(world.component_for_entity(ent, SkillsComponent), skill) + gain)
                world.component_for_entity(ent, Skills)[skill] = world.component_for_entity(ent, Skills)[skill] + gain

                State.messages.push ["You gain " + gain + " skill points!", [115, 255, 115]] # libtcod light green

            else
                # +1 if we didn't
                world.component_for_entity(ent, Skills)[skill] = world.component_for_entity(ent, Skills)[skill] + 1
                State.messages.push ["You gain 1 skill point", [115, 255, 115]]
        return true
    else
        if player
            # if we failed, the check for gain is different
            tick = State.rng.roller("1d100")

            # roll OVER the current skill
            if tick > sk
                # +1 if we succeeded, else nothing
                world.component_for_entity(ent, Skills)[skill] = world.component_for_entity(ent, Skills)[skill] + 1
                State.messages.push ["You learn from your failure and gain 1 skill point", [115, 255, 115]] # libtcod light green

        return false


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

                # message
                attacker_name = @world.component_for_entity(attacker_id, Name)
                target_name = @world.component_for_entity(target_id, Name)

                # roll attack
                attack_roll = State.rng.roller("!d100")
                attack_skill = @world.component_for_entity(attacker_id, Skills).melee
                # d100 roll under
                if skill_test("melee", attacker_id, @world)
                #if attack_roll < 55
                    # target hit!

                    attacker_stats = @world.component_for_entity(attacker_id, Stats)
                    target_stats = @world.component_for_entity(target_id, Stats)

                    # deal damage!

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

                    # color
                    player_hit = @world.component_for_entity(target_id, Player)
                    color = [255,255,255]
                    if player_hit
                        color = [255,0,0]
                    else
                        color = [127, 127, 127] # libtcod light gray

                    State.messages.push [attacker_name.name + " attacks " + target_name.name + " for " + damage + " damage!", color]
                else
                    # miss
                    State.messages.push [attacker_name.name + " attacks " + target_name.name + " but misses!", [115, 115, 255]] # libtcod light blue


            # cleanup
            @world.remove_component(ent, Combat)
            
        
        return # avoid coffeescript's implicit return

export { CombatProcessor }