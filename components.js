// Velocity component
class Velocity {
    constructor() {
      this.dx = this.dy = 0;
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

  export { Velocity, Position, Player, TurnComponent, Renderable }