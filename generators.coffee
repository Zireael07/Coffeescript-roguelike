import { Renderable, Name, Stats} from './components.js';
import { State } from './js_game_vars.js';

generate_npc = (m_id) ->
    #console.log("Generating...")
    if m_id == 'None' or m_id == null
        console.log("Wanted id of None, aborting")
        return

    console.log("Generating monster with id " + m_id)

    console.log(State.npc_data)

    # paranoia
    unless m_id of State.npc_data # object presence 
        console.log("Don't know how to generate " + m_id + "!")
        return

    comps = []
    # Components we want
    comps.push new Renderable(State.npc_data[m_id]['renderable']['glyph'], State.npc_data[m_id]['renderable']['fg'])
    comps.push new Name(State.npc_data[m_id]['name'])
    comps.push new Stats(State.npc_data[m_id]['stats']['hp'], State.npc_data[m_id]['stats']['power'])

    return comps

export { generate_npc }