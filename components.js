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

class Faction {
  constructor(faction="enemy") {
    this.faction = faction;
  }
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

class Skills {
  constructor(melee=55, dodge=25){
    this.melee = melee;
    this.dodge = dodge;
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
  constructor(slot="BODY", owner) {
    this.owner = owner;
    this.slot = slot;
  }
}

class Wearable {
  constructor(slot="BODY"){
    this.slot = slot;
  }
}

class Weapon {
  constructor(damage="1d4"){
    this.damage = damage;
  }
}

class MeleeBonus{
  constructor(bonus=2) {
    this.bonus = bonus;
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
    NPC, Faction, Combat, Stats, Skills, Name, Dead, Skip,
    Item, WantToPickup, InBackpack, Equipped, Wearable, Weapon, MeleeBonus, WantToUseItem, MedItem, 
    WantToDrop, Ranged, Cursor
   }