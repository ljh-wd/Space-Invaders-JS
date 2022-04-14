const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let y = canvas.height - 120;
const dy = -2;

//
// Creating the player.
//

class Spaceship {
  constructor() {
    this.opacity = 1;
    const img = new Image();
    img.src = "./Images/spaceship.png";
    img.onload = () => {
      const scale = 0.1;
      this.opacity = 1;
      this.img = img;
      this.width = img.width * scale;
      this.height = img.height * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      };
      this.velocity = {
        x: 0,
        y: 0,
      };
    };
  }

  draw() {
    if (this.img)
      context.drawImage(
        this.img,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
  }
}

//
// Creating the Laser.
//

class Laser {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = 5;
  }

  draw() {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, 50 * Math.PI);
    context.fillStyle = "red";
    context.fill();
    context.stroke();
    context.closePath();
  }

  update() {
    // context.clearRect(0, 0, canvas.width, canvas.height);
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

//
// Creating the Invader
//

class Invader {
  constructor({ position }) {
    const img = new Image();
    img.src = "./Images/Invader.png";
    img.onload = () => {
      const scale = 0.04;
      this.img = img;
      this.width = img.width * scale;
      this.height = img.height * scale;
      this.position = {
        x: position.x,
        y: position.y,
      };
      this.velocity = {
        x: 0,
        y: 0,
      };
    };
  }

  draw() {
    if (this.img)
      context.drawImage(
        this.img,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
  }

  update({ velocity }) {
    if (this.img) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }

  shoot(alienLasers) {
    alienLasers.push(
      new AlienLaser({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },
        velocity: {
          x: 0,
          y: 5,
        },
      })
    );
  }
}

//
// Creating the invader grid system
//

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };

    this.velocity = {
      x: 5,
      y: 0,
    };

    this.invaders = [];

    const cols = Math.floor(Math.random() * 10 + 5);
    const rows = Math.floor(Math.random() * 3 + 2);
    this.width = cols * 40;

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Invader({
            position: {
              x: x * 40,
              y: y * 40,
            },
          })
        );
      }
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.velocity.y = 0;

    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 30;
    }
  }
}

//
// Creating the background
//

class Star {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 1.5;
  }

  draw() {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, 5 * Math.PI);
    context.fillStyle = "#fff";
    context.fill();
    context.stroke();
    context.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

//
// Creating invader laser
//

class AlienLaser {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = 5;
  }

  draw() {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, 50 * Math.PI);
    context.fillStyle = "lime";
    context.fill();
    context.stroke();
    context.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

let gameOver = false;
const scoreText = document.querySelector("span");
let score = 0;
const spaceship = new Spaceship();
const grids = [];
const lasers = [];
const alienLasers = [];
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

spaceship.draw();

let frames = 0;
let game = {
  over: false,
};

const stars = [];

function loopingAnimation() {
  if (game.over) {
    alert(`Game over! Your got a score of: ${scoreText.textContent}`);
    document.location.reload();
    return;
  }
  requestAnimationFrame(loopingAnimation);
  for (let i = 0; i < 0.1; i++) {
    stars.push(
      new Star({
        position: {
          x: Math.floor(Math.random() * canvas.width),
          y: canvas.height - canvas.height,
        },
        velocity: {
          x: 0,
          y: Math.random() * 5 + 2,
        },
      })
    );
  }

  context.fillStyle = "hsl(230, 100%, 3%)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.globalAlpha = this.opacity;
  spaceship.draw();
  lasers.forEach((laser) => {
    laser.update();
  });

  stars.forEach((star) => {
    star.update();
  });

  if (keys.a.pressed && spaceship.position.x >= 0)
    spaceship.position.x += spaceship.velocity.x = -7;
  if (keys.d.pressed && spaceship.position.x + spaceship.width <= canvas.width)
    spaceship.position.x += spaceship.velocity.x = 7;

  grids.forEach((grid) => {
    grid.update();
    if (frames % 100 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        alienLasers
      );
    }
    grid.invaders.forEach((alien, i) => {
      if (alien.position.y >= spaceship.position.y) game.over = true;
      alien.update({
        velocity: grid.velocity,
      });
      lasers.forEach((laser, a) => {
        if (
          laser.position.y - laser.radius <= alien.position.y + alien.height &&
          laser.position.x + laser.radius >= alien.position.x &&
          laser.position.x - laser.radius <= alien.position.x + alien.width &&
          laser.position.y + laser.radius >= alien.position.y
        ) {
          setTimeout(() => {
            const alienFound = grid.invaders.find((alien) => alien === alien);

            const laserFound = lasers.find((laser) => laser === laser);

            if (alienFound && laserFound) {
              grid.invaders.splice(i, 1);
              lasers.splice(a, 1);
              score += 100;
              scoreText.textContent = score;

              const firstInvader = grid.invaders[0];
              const lastInvader = grid.invaders[grid.invaders.length - 1];

              grid.width =
                lastInvader.position.x -
                firstInvader.position.x +
                lastInvader.width;

              grid.position.x = firstInvader.position.x;
            }
          }, 0);
        }
      });
    });
  });
  alienLasers.forEach((alienLaser, index) => {
    if (alienLaser.position.y >= canvas.height) {
      setTimeout(() => {
        alienLasers.splice(index, 1);
      }, 0);
    } else {
      alienLaser.update();
    }

    if (
      alienLaser.position.y - alienLaser.radius <=
        spaceship.position.y + spaceship.height &&
      alienLaser.position.x + alienLaser.radius >= spaceship.position.x &&
      alienLaser.position.x - alienLaser.radius <=
        spaceship.position.x + spaceship.width &&
      alienLaser.position.y + alienLaser.radius >= spaceship.position.y + 45
    ) {
      game.over = true;
    }
  });

  if (frames % 1000 === 0) grids.push(new Grid());

  frames++;
}

loopingAnimation();

window.addEventListener("keydown", moveSpaceship);

function moveSpaceship({ key }) {
  switch (key) {
    case "a" || "A":
      keys.a.pressed = true;
      break;

    case "d" || "D":
      keys.d.pressed = true;
      break;

    case " ":
      keys.space.pressed = true;
      lasers.push(
        new Laser({
          position: {
            x: spaceship.position.x + 35,
            y: spaceship.position.y - 10,
          },
          velocity: {
            x: 0,
            y: -10,
          },
        })
      );
      break;
  }

  addEventListener("keyup", ({ key }) => {
    switch (key) {
      case "a" || "A":
        keys.a.pressed = false;
        break;

      case "d" || "D":
        keys.d.pressed = false;

        break;

      case " ":
        keys.space.pressed = false;
        break;
    }
  });
}
