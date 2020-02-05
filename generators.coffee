import { Renderable, Name, Stats, Faction, MedItem, Ranged, Wearable, Weapon, MeleeBonus} from './components.js';
import { State } from './js_game_vars.js';
import { RenderOrder } from './enums.js';

generate_npc = (m_id) ->
    #console.log("Generating...")
    if m_id == 'None' or m_id == null
        console.log("Wanted id of None, aborting")
        return

    console.log("Generating monster with id " + m_id)

    #console.log(State.npc_data)

    # paranoia
    unless m_id of State.npc_data # object presence 
        console.log("Don't know how to generate " + m_id + "!")
        return

    comps = []
    # Components we want
    lookup = { 1: RenderOrder.ITEM, 2: RenderOrder.ACTOR }
    #console.log(lookup[State.npc_data[m_id]['renderable']['order']])

    comps.push new Renderable(State.npc_data[m_id]['renderable']['glyph'], State.npc_data[m_id]['renderable']['fg'], lookup[State.npc_data[m_id]['renderable']['order']])
    comps.push new Name(State.npc_data[m_id]['name'])
    comps.push new Stats(State.npc_data[m_id]['stats']['hp'], State.npc_data[m_id]['stats']['power'])

    # optional components
    if 'faction' of State.npc_data[m_id]
        comps.push new Faction(State.npc_data[m_id]['faction'].toLowerCase())
    else
        comps.push new Faction("enemy")


    # equip equipment
    equip_list = []
    if 'equipment' of State.npc_data[m_id]
        for e_id in State.npc_data[m_id]['equipment'] # array, so "in"
            npc_equip_id = e_id.toLowerCase()
            equip_list.push npc_equip_id

    return [comps, equip_list]

generate_item = (_id) ->

    if _id == 'None' or _id == null
        console.log("Wanted id of None, aborting")
        return
    
    console.log("Generating item with id " + _id)

    #console.log(State.items_data)

    # paranoia
    unless _id of State.items_data # object presence
        console.log("Don't know how to generate " + _id + "!")
        return
    
    comps = []
    # Components we want
    lookup = { 1: RenderOrder.ITEM, 2: RenderOrder.ACTOR }
    #console.log(lookup[State.items_data[_id]['renderable']['order']])

    comps.push new Renderable(State.items_data[_id]['renderable']['glyph'], State.items_data[_id]['renderable']['fg'], lookup[State.items_data[_id]['renderable']['order']])
    comps.push new Name(State.items_data[_id]['name'])

    # optional components
    if 'consumable' of State.items_data[_id]
        if 'effects' of State.items_data[_id]['consumable']
            #console.log("Eff: " + items_data[_id]['consumable']['effects'])
            if 'med_item' of State.items_data[_id]['consumable']['effects']
                comps.push new MedItem(State.items_data[_id]['consumable']['effects']['med_item'])
            if 'ranged' of State.items_data[_id]['consumable']['effects']
                comps.push new Ranged(State.items_data[_id]['consumable']['effects']['ranged'])
            # if 'area_of_effect' of items_data[_id]['consumable']['effects']
            #     comps.push AreaOfEffect(items_data[_id]['consumable']['effects']['area_of_effect'])

    if 'wearable' of State.items_data[_id]
        comps.push new Wearable(State.items_data[_id]['wearable']['slot'].toUpperCase())
    if 'weapon' of State.items_data[_id]
        comps.push new Weapon(State.items_data[_id]['weapon'])
        console.log (State.items_data[_id]['weapon'])
    if 'melee_bonus' of State.items_data[_id]
        comps.push new MeleeBonus(State.items_data[_id]['melee_bonus'])



    return comps

export { generate_npc, generate_item }