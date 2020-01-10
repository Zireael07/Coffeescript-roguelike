# based on Python's Esper module

import { intersect_lists, remove_list } from './intersection.js'

class World
    constructor: () ->
        @processors = []
        # for processors added on the fly
        @to_execute = []
        @next_entity_id = 0
        @components = {}
        @entities = {}
        @dead_entities = new Set

    clear_database: ->
        # remove all entities and components from World
        @next_entity_id = 0
        @components.length = 0
        @entities.length = 0
        @dead_entities.length = 0

    add_processor: (processor) ->
        # Add processor to the world
        processor.world = this
        @processors.push(processor)

    add_and_run_processor: (processor) ->
        # Add a processor to the world
        processor.world = this

        @processors.push(processor)
        @to_execute.push(processor)

        console.log "Added a processor..."
        return

    remove_processor: (processor_type) ->
        # Remove processor by type
        for processor in @processors
            # check type
            if processor instanceof processor_type 
                processor.world = null
                # remove from array
                #@processors.filter(item => item != processor) # !== in JS
                @processors = remove_list(@processors, processor)
                #console.log @processors

        return # avoid implicit return
    
    get_processor: (processor_type) ->
        for processor in @processors
            # check type
            #console.log processor instanceof processor_type
            if processor instanceof processor_type
                return processor

    create_entity: (components) ->
        @next_entity_id += 1
        #console.log components
        # prevent crash
        unless components == undefined
            for component in components
                #console.log component
                this.add_component(@next_entity_id, component)

        return @next_entity_id

    delete_entity: (entity) ->
        # Perform delayed deletion
        @dead_entities.push entity

    component_for_entity: (entity, component) ->
        component_type = component.name #get our %$^$ type
        #console.log component_type
        #console.log @entities[entity][component_type]
        @entities[entity][component_type]

    #components_for_entity: (entity) ->
        # Returns all components for entity
        # useful for saving state

    has_component: (entity, component_type) ->
        #console.log(component_type)
        #console.log(component_type in @entities[entity])
        component_type in @entities[entity]

    add_component: (entity, component) ->
        component_type = component.constructor.name #get our %$^$ type
        ##console.log component.constructor.name

        unless component_type of @components # object presence 
            ##console.log component_type of @components
            @components[component_type] = [] #new Set
            ##console.log @components[component_type]

        # effectively same as a set
        unless entity in @components[component_type]
            @components[component_type].push entity

        if entity not of @entities
            @entities[entity] = {}

        @entities[entity][component_type] = component

    remove_component: (entity, component) ->
        # Remove a component by type
        component_type = component.name # get our %$^#$ type
        #console.log component_type
        #console.log @components[component_type]
        #@components[component_type].filter(item => item != entity)
        @components[component_type] = remove_list(@components[component_type], entity)

        if not @components[component_type]
            delete @components[component_type]

        delete @entities[entity][component_type]

        if not @entities[entity]
            delete @entities[entity]

        return # avoid implicit return

    # internals
    get_int_component: (component_type) ->
        #console.log component_type of @components
        # crash fix
        unless component_type of @components
            return null
        #console.log "Get int for: " + component_type
        #console.log "Get internal: " + @components[component_type]
        for entity in @components[component_type]
            #console.log entity

            yield [entity, @entities[entity][component_type] ]

    get_int_components: (component_types...) ->
        lists = []
        # Gets an iterator for multiple component types
        lists.push @components[ct] for ct in component_types
        #console.log "Lists: " + lists
        inters = intersect_lists(lists)
        #console.log "Intersection: " + inters
        for entity in inters
            #console.log "Ent in inters: " + entity
            ret = []
            ret.push @entities[entity][ct] for ct in component_types
            #console.log ret
            yield [entity, ret ]

    # public API
    get_component: (component_typeclass) ->
        #console.log "Getting... " + component_typeclass.name
        component_type = component_typeclass.name #get our %$^$ type
        res = this.get_int_component(component_type)
        #console.log(res)
        query for query from res

    get_components: (component_typesclass...) ->
        component_types = []
        for type in component_typesclass
            component_types.push type.name # get our #$%#@# type
        
        query for query from this.get_int_components(component_types...)

    clear_dead_entities: ->
        #Finalize deletion of any Entities that are marked dead
        for entity in @dead_entities
            for component_type in @entities[entity]
                #@components[component_type].delete entity
                @components[component_type].filter(item => item != entity)

                if not @components[component_type]
                    delete @components[component_type]

            delete @entities[entity]

        @dead_entities.length = 0

    _process: ->
        for processor in @processors
            #console.log processor
            processor.process()

    _execute: () ->
        console.log "Executing..."
        # any that were added on the fly
        for processor in @to_execute
            console.log processor + " to execute "
            processor.process()
            @to_execute = remove_list(@to_execute, processor)

        return # avoid implicit return

    process: ->
        #Call the process method on all Processors
        # In addition, all entities that were marked for deletion since the last call will be deleted
        
        this.clear_dead_entities()
        this._process()
        this._execute()
        return # avoid implicit return

export { World }    