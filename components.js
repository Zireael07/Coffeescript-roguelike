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



  export { Velocity, Position, Player, TurnComponent, Renderable, TileBlocker,
    NPC, Combat, Stats, Name, Dead }