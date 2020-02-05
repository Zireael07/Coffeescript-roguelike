import { WantToUseItem, MedItem, Stats, Name, Skip, Ranged, Position, Cursor, Wearable, Equipped, InBackpack } from '../components.js';
import { State } from '../js_game_vars.js';
import { tiles_distance_to } from '../map_common.js';

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

            # equip/unequip
            if @world.component_for_entity(item_id, Wearable)
                # if not equipped already
                unless @world.component_for_entity(item_id, Equipped)
                    slot = @world.component_for_entity(item_id, Wearable).slot

                    # unequip anything we might have in the slot
                    for [item_ent, comps] in @world.get_components(Equipped, Name)
                        [equipped, name] = comps
                        if (equipped.slot == slot and equipped.owner == ent)
                            ent_name = @world.component_for_entity(ent, Name)
                            State.messages.push [ ent_name.name + " unequips " + name.name, [255, 255, 255]]
                            @world.remove_component(item_ent, Equipped)
                            @world.add_component(item_ent, new InBackpack())

                    # equip
                    @world.add_component(item_id, new Equipped(slot, ent))
                    @world.remove_component(item_id, InBackpack)

                    ent_name = @world.component_for_entity(ent, Name)
                    item_name = @world.component_for_entity(item_id, Name)
                    State.messages.push [ ent_name.name + " equips " + item_name.name, [255,255,255] ]
                else
                    # unequip
                    ent_name = @world.component_for_entity(ent, Name)
                    item_name = @world.component_for_entity(item_id, Name)
                    State.messages.push [ ent_name.name + " unequips " + ent_name.name, [255, 255, 255]]
                    @world.remove_component(item_id, Equipped)
                    @world.add_component(item_id, new InBackpack())


            # if item is a ranged item and we have a cursor
            if @world.component_for_entity(item_id, Ranged)
                ranged = @world.component_for_entity(item_id, Ranged)
                player_pos = @world.component_for_entity(ent, Position)

                if @world.component_for_entity(ent, Cursor)
                    tg_x = @world.component_for_entity(ent, Cursor).x
                    tg_y = @world.component_for_entity(ent, Cursor).y
                    if tiles_distance_to([player_pos.x, player_pos.y], [tg_x, tg_y]) > ranged.range
                        console.log("Distance exceeded")
                        # remove cursor
                        @world.remove_component(ent, Cursor)
                        
                    else
                        # is there an entity?
                        targeted = null
                        for [tg_ent, comps] in @world.get_components(Position, Stats)
                            [pos, stats] = comps
                            if pos.x == tg_x && pos.y == tg_y
                                targeted = tg_ent
                                stats.hp -= 6 #dummy

                                # message
                                name = @world.component_for_entity(ent, Name)
                                tg_name = @world.component_for_entity(tg_ent, Name)

                                State.messages.push [name.name + " shoots " + tg_name.name + " for 6 damage!", [255, 0, 0]]

                        if targeted == null
                            State.messages.push ["No target selected", [255, 255, 255]]
                        else
                            # be nice, only take the item away if there's a target
                            @world.add_component(item_id, new Skip()) # using it to mark item as being removed
                            @world.delete_entity(item_id)

                        # remove cursor
                        @world.remove_component(ent, Cursor)

            # cleanup
            @world.remove_component(ent, WantToUseItem)
            

        
        return # avoid coffeescript's implicit return

export { UseItemProcessor }