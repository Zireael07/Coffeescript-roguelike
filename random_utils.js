import { State } from './js_game_vars.js'

function createTableFromSizes(def) {
    var rangeResultPairs = rangeResultPairsFromSizes(def);
    return rangeResultPairs;
  }

  function rangeResultPairsFromSizes(def) {
    var rangeResultPairs = [];
    var nextLowerBound = 0;

    return def.map(sizeResultToRangeResult);

    //input - a size and result tuple (2-item array)
    function sizeResultToRangeResult(input) {
      var size = input[0];
      var result = input[1];

      var upperBound = nextLowerBound + size - 1;
      var range = [nextLowerBound, upperBound];
      nextLowerBound = upperBound + 1;

      return [range, result];
    }
  }


// Looks up what outcome corresponds to the given index. Returns undefined
  // if the index is not inside any range.
  function resultAtIndex(table, index) {
      console.log("Looking up result for index ..." + index);

    for (var i = 0; i < table.length; ++i) {
      var rangeResult = table[i];
      var range = rangeResult[0];
      //console.log("Range: " + range);
      if (index >= range[0] && index <= range[1]) {
        console.log("Returning..." + rangeResult[1]);
        return rangeResult[1];
      }
    }
  }

// actual tables

function generate_item_rarity(){
    var chances = []

    chances.push([25, "Pistol"])
    chances.push([50, "Medkit"])
    chances.push([15, "Combat Knife"])

    return createTableFromSizes(chances);
}

function generate_random_item(){
    var item_chances = generate_item_rarity();
    var roll = State.rng.roller("1d100");

    return resultAtIndex(item_chances, roll);
}

function generate_NPC_rarity(){
  var chances = []

  chances.push([80, "Thug"])
  chances.push([20, "Cop"])

  return createTableFromSizes(chances)
}

function generate_random_NPC() {
  var chances = generate_NPC_rarity();
  var roll = State.rng.roller("1d100");

  return resultAtIndex(chances, roll);
}

export { generate_random_item, generate_random_NPC }