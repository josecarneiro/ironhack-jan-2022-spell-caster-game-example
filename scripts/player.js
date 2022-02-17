const playerImage = new Image();
playerImage.src = 'images/player.png';

class Player {
  constructor(gameInstance) {
    this.game = gameInstance;
    this.x = 300;
    this.y = 150;
    this.width = 50;
    this.height = 50;
    this.frame = 1;
  }

  draw() {
    this.frame++;
    this.game.context.save();
    // In a method of the game class,
    // "this" refers to the instance
    // of the game class on which
    // the method is being called
    // this.game.context.fillStyle = 'blue';
    // Draw a blue square on the canvas
    // this.game.context.fillRect(this.x, this.y, this.width, this.height);
    this.game.context.drawImage(
      playerImage,
      13 + 64 * (this.frame % 8),
      38,
      34,
      34,
      this.x,
      this.y,
      this.width,
      this.height
    );
    this.game.context.restore();
  }
}
