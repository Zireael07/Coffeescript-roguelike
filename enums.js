import {struc_Tile } from './tile_lookup.js'

//https://stijndewitt.com/2014/01/26/enums-in-javascript/
const TileTypes = Object.freeze({
    WALL:   1,
    FLOOR:  2,
    data: {
      1 : new struc_Tile("wall", "#", true),
      2 : new struc_Tile("floor", ".", false)
    }
  });


  const Directions = Object.freeze({
    NORTH = [0, -1],
    SOUTH = [0, 1],
    EAST = [1, 0],
    WEST = [-1, 0],
    NORTHEAST = [1, -1],
    NORTHWEST = [-1, -1],
    SOUTHEAST = [1, 1],
    SOUTHWEST = [-1, 1],
    CENTER = [0,0],
  })

 export { TileTypes, Directions } 