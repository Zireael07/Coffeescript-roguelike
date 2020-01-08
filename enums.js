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

 export { TileTypes } 