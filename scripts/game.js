// Every class in our game architecture
// will have a runLogic method that is responsible
// for executing the logic for that game element
// and a draw method, that is responsible for drawing
// that element to the canvas

const enemyBumpSound = new Audio('sounds/HONK.wav');

enemyBumpSound.play();

class Game {
  constructor(canvasElement, screens) {
    this.canvas = canvasElement;
    this.context = canvasElement.getContext('2d');
    this.screens = screens;
    this.running = false;
    this.enableControls();
  }

  start() {
    this.running = true;
    this.score = 100;
    this.player = new Player(this);
    this.enemies = [];
    this.spells = [];

    this.displayScreen('playing');

    this.loop();
  }

  displayScreen(name) {
    for (let screenName in this.screens) {
      this.screens[screenName].style.display = 'none';
    }
    this.screens[name].style.display = '';
  }

  lose() {
    this.running = false;
    this.displayScreen('end');
  }

  enableControls() {
    window.addEventListener('keydown', (event) => {
      if (this.running) {
        // Will stop page from scrolling
        const code = event.code;
        switch (code) {
          case 'ArrowUp':
            event.preventDefault();
            this.player.y -= 10;
            break;
          case 'ArrowDown':
            event.preventDefault();
            this.player.y += 10;
            break;
          case 'ArrowRight':
            event.preventDefault();
            this.player.x += 10;
            break;
          case 'ArrowLeft':
            event.preventDefault();
            this.player.x -= 10;
            break;
          case 'Space':
            event.preventDefault();
            this.fireSpell();
            break;
        }
      }
    });
  }

  fireSpell() {
    const spellY = this.player.y + this.player.height / 2 - 5 / 2;
    const spell = new Spell(this, this.player.x, spellY);
    this.spells.push(spell);
  }

  generateEnemy() {
    const enemySpeed = Math.random() + 0.5;
    const enemyX = this.canvas.width;
    const enemyY = Math.random() * this.canvas.height - 75;
    const enemy = new Enemy(this, enemyX, enemyY, enemySpeed);
    this.enemies.push(enemy);
  }

  loop() {
    window.requestAnimationFrame(() => {
      this.runLogic();
      this.draw();
      if (this.running) {
        this.loop();
      }
    });
  }

  runLogic() {
    if (Math.random() < 0.01) {
      this.generateEnemy();
    }
    for (const enemy of this.enemies) {
      this.runEnemyLogic(enemy);
    }
    for (const spell of this.spells) {
      this.runSpellLogic(spell);
    }
    if (this.score <= 0) {
      this.lose();
    }
  }

  runEnemyLogic(enemy) {
    enemy.runLogic();
    // If enemy and player are intersecting,
    // remove enemy from array of enemies
    const enemyAndPlayerAreIntersecting = enemy.checkIntersection(this.player);
    const enemyIsOutOfBounds = enemy.x + enemy.width < 0;
    if (enemyAndPlayerAreIntersecting || enemyIsOutOfBounds) {
      enemyBumpSound.play();
      const indexOfEnemy = this.enemies.indexOf(enemy);
      this.enemies.splice(indexOfEnemy, 1);
      this.score -= 10;
    }
  }

  runSpellLogic(spell) {
    spell.runLogic();
    for (const enemy of this.enemies) {
      // If enemy and spell are intersecting,
      // remove enemy from array of enemies
      // and remove spell from array of spells
      const spellAndEnemyAreIntersecting = enemy.checkIntersection(spell);
      if (spellAndEnemyAreIntersecting) {
        const indexOfEnemy = this.enemies.indexOf(enemy);
        this.enemies.splice(indexOfEnemy, 1);
        const indexOfSpell = this.spells.indexOf(spell);
        this.spells.splice(indexOfSpell, 1);
        this.score += 5;
      }
    }
    if (spell.x - spell.width > this.canvas.width) {
      const indexOfSpell = this.spells.indexOf(spell);
      this.spells.splice(indexOfSpell, 1);
    }
  }

  drawScore() {
    this.context.font = '48px monospace';
    this.context.fillText(`Score: ${this.score}`, 150, 450);
  }

  draw() {
    this.context.clearRect(0, 0, 500, 500);
    for (const enemy of this.enemies) {
      enemy.draw();
    }
    for (const spell of this.spells) {
      spell.draw();
    }
    this.player.draw();
    this.drawScore();
  }
}
