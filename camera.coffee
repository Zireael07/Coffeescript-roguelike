class Camera
    constructor: () -> 
        @width = 10
        @height = 10
        @x = 0
        @y = 0
        @top_x = 0
        @top_y = 0
        @offset = [0,0]

    start_update: -> 
        target_pos = [1, 1]
        @offset = [target_pos[0] - @x, target_pos[1] - @y]

    update: (position) ->
        # this calculates cells
        @x = position.x
        @y = position.y
        @top_x = (@x - @width / 2)
        @top_y = (@y - @height / 2)

    debug_update: -> 
        @top_x = @x - @width / 2
        @top_y =  @y - @height / 2

    debug_move: (x, y) ->
        @x = x 
        @.y = y
        this.debug_update()

        target_pos = [80, 20]

        @offset = [target_pos[0] - @x, target_pos[1] - @y]
        #print("Offset: " + str(self.offset))


    move: (dx, dy) ->
        # straightforward for cartesian coords
        @offset = [@offset[0] + dx, @offset[1] + dy]

    # camera extents to speed up rendering
    get_width_start: -> 
        if @top_x > 0
            return @top_x
        else
            return 0

    get_width_end: (map_draw) ->
        if @top_x + @width <= map_draw.length  # constants.MAP_WIDTH:
            return @top_x + @width
        else
            return map_draw.length  # constants.MAP_WIDTH

    get_height_start: ->
        if @top_y > 0
            return @top_y
        else
            return 0

    get_height_end: (map_draw) ->
        if @top_y + @height <= map_draw[0].length  # constants.MAP_HEIGHT:
            return (@top_y + @height)
        else
            return map_draw[0].length  # constants.MAP_HEIGHT

export { Camera }