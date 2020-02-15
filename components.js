import { RenderOrder, Movement } from './enums.js';

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

//game loop control
class TurnComponent {
  constructor() {}
}

class Pause {
  constructor() {}
}


class Renderable {
  constructor(char="h", color=[255,255,255], order=RenderOrder.ACTOR) {
    this.char = char;
    this.color = color;
    this.render_order = order;
  }
}

class NPC {
  constructor() {}
}

class AIMovement {
  constructor(move=Movement.STATIC) {
    this.move = move;
  }
}

class Faction {
  constructor(faction="enemy") {
    this.faction = faction;
  }
}

// class WantToApproach {
//   constructor(pos){
//     this.position = pos;
//   }
// }

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

//aka Stats in many RPG systems
class Attributes {
  constructor(strength=9, dexterity=9, constitution=9, intelligence=9, wisdom=9, charisma=9){
    this.strength = strength;
    this.dexterity = dexterity;
    this.constitution = constitution;
    this.intelligence = intelligence;
    this.wisdom = wisdom;
    this.charisma = charisma;
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

class VisibilityBlocker {
  constructor() {}
}

class Door {
  constructor(open=false){
    this.open = open;
  }
}


  export { Velocity, Position, Player, TurnComponent, Pause, Renderable, TileBlocker,
    NPC, AIMovement, Faction, Combat, Stats, Attributes, Skills, Name, Dead, Skip,
    Item, WantToPickup, InBackpack, Equipped, Wearable, Weapon, MeleeBonus, WantToUseItem, MedItem, 
    WantToDrop, Ranged, Cursor, VisibilityBlocker, Door
   }