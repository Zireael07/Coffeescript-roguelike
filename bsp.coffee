#based on https://eskerda.com/bsp-dungeon-generation/ and https://github.com/AtTheMatinee/dungeon-generation

import { State } from './js_game_vars.js';
import { Rect } from './map_common.js'

class Tree
    constructor: (@rootRect, m_leaf=15) ->
        @MAX_LEAF_SIZE = m_leaf
        @MIN_LEAF_SIZE = 8
        @rootLeaf = new Leaf(@rootRect)

    split_tree: ->
        @leafs = []
        @leafs.push @rootLeaf

        splitSuccessfully = true

        # loop through all leaves until they can no longer split successfully
        while (splitSuccessfully)
            splitSuccessfully = false
            for l in @leafs
                console.log l.leaf
                if (l.lchild == undefined) && (l.rchild == undefined)
                    #console.log("No children of the leaf")
                    if ((l.leaf.w > @MAX_LEAF_SIZE) or 
                    (l.leaf.h > @MAX_LEAF_SIZE) or
                    (State.rng.range(0,10) > 8))
                        #console.log("Try to split the leaf")
                        if (l.split_leaf(@MIN_LEAF_SIZE)) #try to split the leaf
                            console.log "Split leaf..."
                            @leafs.push l.lchild
                            @leafs.push l.rchild
                            splitSuccessfully = true


        return # axe default return
    
class Leaf
    # "leaf" is just a rect    
    constructor: (@leaf) ->
        @lchild = undefined
        @rchild = undefined

    # pass down the min size
    split_leaf: (m_leaf) ->
        # begin
        if @lchild != undefined && @rchild != undefined
            return false # this leaf has already been split
        
        # determine split
        if (State.rng.range(0, 1) == 0)
            # Split vertically
            splitHorizontally = false
        else
            splitHorizontally = true

        # if width of the leaf is 25% bigger than height, split vertically
        # and the converse for horizontal split
        if (@leaf.w/@leaf.h) >= 1.25
            splitHorizontally = false
        else if (@leaf.h/@leaf.w) >= 1.25
            splitHorizontally = true 
        
        console.log("Splitting horizontally: " + splitHorizontally)

        # respect min sizes
        if (splitHorizontally)
            max = @leaf.h - m_leaf
        else
            max = @leaf.w - m_leaf

        if (max <= m_leaf)
            console.log("Leaf too small to split, " + m_leaf)
            return false # the leaf is too small to split further

        split = State.rng.range(m_leaf, max) #determine where to split

        if (splitHorizontally)
            @lchild = new Leaf(
                new Rect(@leaf.x1, @leaf.y1, @leaf.w, split) 
            )
            @rchild = new Leaf(
                new Rect(@leaf.x1, @leaf.y1+@lchild.leaf.h, @leaf.w, @leaf.h - @lchild.leaf.h)
            )
            console.log(@lchild)
            console.log(@rchild)
        else
            @lchild = new Leaf(
                new Rect(@leaf.x1, @leaf.y1, split, @leaf.h)
            )
            @rchild = new Leaf(
                new Rect(@leaf.x1+@lchild.leaf.w, @leaf.y1, @leaf.w - @lchild.leaf.w, @leaf.h)
            )
            console.log(@lchild)
            console.log(@rchild)

        return true

    get_leafs: ->
        if @lchild == undefined && @rchild == undefined
            return @leaf
        else
            return [].concat(@lchild.get_leafs(), @rchild.get_leafs())

    get_level: (level, queue) ->
        if queue == undefined
            queue = []
        if level == 1
            queue.push(this)
        else
            if this.lchild != undefined
                this.lchild.get_level(level-1, queue)
            if this.rchild != undefined
                this.rchild.get_level(level-1, queue)

        return queue


random_split = (rect, discard = false, w_ratio = 0.45, h_ratio = 0.45) ->
    #console.log("Splitting: ")
    #console.log(rect)
    r1 = null
    r2 = null
    if (State.rng.range(0, 1) == 0)
        #console.log("Split vertical")
        # Vertical
        r1 = new Rect(
            rect.x1, rect.y1,             # r1.x, r1.y
            State.rng.range(1, rect.w), rect.h   # r1.w, r1.h # ensure a margin
        )
        r2 = new Rect(
            rect.x1 + r1.w, rect.y1,      # r2.x, r2.y
            rect.w - r1.w, rect.h       # r2.w, r2.h
        )
        #console.log(r1)
        #console.log(r2)
        if discard
            r1_w_ratio = r1.w / r1.h
            r2_w_ratio = r2.w / r2.h
            if r1_w_ratio < w_ratio || r2_w_ratio < w_ratio
                return random_split(rect, discard)
        

    else
        # Horizontal
        #console.log("Split horizontal")
        r1 = new Rect(
            rect.x1, rect.y1,             # r1.x, r1.y
            rect.w, State.rng.range(1, rect.h)   # r1.w, r1.h # ensure a margin
        )
        r2 = new Rect(
            rect.x1, rect.y1 + r1.h,      # r2.x, r2.y
            rect.w, rect.h - r1.h       # r2.w, r2.h
        )

        if discard
            r1_h_ratio = r1.h / r1.w
            r2_h_ratio = r2.h / r2.w
            if r1_h_ratio < h_ratio || r2_h_ratio < h_ratio
                return random_split(rect, discard)

    #console.log("Split 1: ")
    #console.log(r1)
    #console.log("Split 2: ")
    #console.log(r2)

    return [r1, r2]


split_container = (container, iter, discard) ->
    root = new Tree(container)
    if (iter != 0)
        sr = random_split(container, discard)
        root.lchild = split_container(sr[0], iter-1, discard)
        root.rchild = split_container(sr[1], iter-1, discard)

    return root

export { Tree }