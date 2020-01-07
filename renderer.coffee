
# console is a reserved name in JS
redraw_terminal = (position) ->
    terminal = get_terminal()
    # draw player
    terminal[position.x][position.y] = ['@', [255, 255, 255]]

    return [terminal]

get_terminal = ->
    console.log("Terminal...")
    # dummy
    mapa = []
    for x in [0..21]
        mapa.push []
        for y in [0..21]
            mapa[x].push ["&nbsp;", [255,255,255]]

    #mapa = ((["&nbsp;", [255,255,255]] for num in [0..21]) for num in [0..21])

    #console.log(mapa)

    return mapa


#get_terminal()

export { get_terminal, redraw_terminal }