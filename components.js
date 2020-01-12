// Velocity component
class Velocity {
    constructor(dx=0, dy=0) {
      this.dx = dx;
      this.dy = dy;
    }
  }
  
  // Position component
  class Position {
    constructor(x,y) {
      this.x = x; 
      this.y = y;
    }
  }

class Player {
  constructor() {}
}

class TurnComponent {
  constructor() {}
}

class Renderable {
  constructor(char="h", color=[255,255,255]) {
    this.char = char;
    this.color = color;
  }
}

class NPC {
  constructor() {}
}

class TileBlocker {
  constructor() {}
}

class Combat {
  constructor(target) {
    this.target_id = target;
  }
}

class Stats {
  constructor(hp, power) {
    this.hp = hp;
    this.max_hp = hp;
    this.power = power;
  }
}

class Name {
  constructor(name) {
    this.name = name;
  }
}

class Dead {
  constructor() {}
}

class Skip {
  constructor() {}
}

class Item {
  constructor() {}
}

class WantToPickup {
  constructor() {}
}

class InBackpack{ 
  constructor() {}
}

class Equipped {
  constructor(owner) {
    this.owner = owner;
  }
}

class WantToUseItem {
  constructor(item) {
    this.item_id = item;
  }
}

class MedItem {
  constructor(heal=2){
    this.heal = heal;
  }
}

class WantToDrop {
  constructor(item){
    this.item_id = item;
  }
}

class Ranged {
  constructor(range){
    this.range = range;
  }
}

class Cursor {
  constructor(x=0, y=0, item){
    this.x = x;
    this.y = y;
    this.item = item;
  }
}


  export { Velocity, Position, Player, TurnComponent, Renderable, TileBlocker,
    NPC, Combat, Stats, Name, Dead, Skip,
    Item, WantToPickup, InBackpack, Equipped, WantToUseItem, MedItem, 
    WantToDrop, Ranged, Cursor
   }