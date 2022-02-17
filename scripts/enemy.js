const enemyImage = new Image();
enemyImage.src = 'images/enemy.png';

class Enemy {
  constructor(gameInstance, x, y, speed) {
    this.game = gameInstance;
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.speed = speed;
  }

  checkIntersection(element) {
    // We'll use this to check for intersections between player and enemy and spell and enemy
    return (
      // is right edge of element in front of left edge of enemy
      element.x + element.width > this.x &&
      // is left edge of element before of right edge of enemy
      element.x < this.x + this.width &&
      // is bottom edge of element below top edge of enemy
      element.y + element.height > this.y &&
      // is top edge of element above bottom edge of enemy
      element.y < this.y + this.height
    );
  }

  runLogic() {
    this.x -= this.speed;
  }

  draw() {
    this.game.context.save();

    // this.game.context.scale(-1, 1);

    // this.game.context.fillStyle = 'red';
    // this.game.context.fillRect(this.x, this.y, this.width, this.height);
    this.game.context.drawImage(
      enemyImage,
      this.x,
      this.y,
      this.width,
      this.height
    );

    this.game.context.restore();
  }
}
