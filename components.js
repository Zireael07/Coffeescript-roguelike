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

  export { Velocity, Position }