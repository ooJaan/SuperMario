const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.7;

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 30;
    this.height = 30;
  }

  draw() {
    context.fillStyle = "red";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }
  }
}

/////////////////////////PLATFORM//////////////////////////
class Platform {
  constructor(x, y, width, height) {
    this.position = {
      x: x,
      y: canvas.height - y,
    };
    this.width = width;
    this.height = height;
  }

  draw() {
    context.fillStyle = "blue";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const player = new Player();
const platforms = [
//  plats.forEach((plat) => {
//    new Platform(plat[0], plat[1], plat[2], plat[3]);
//  }),

  new Platform(0, 20, 20000, 20),
  new Platform(400, 700, 100, 20),
  new Platform(600, 600, 100, 20),
  new Platform(800, 500, 100, 20),
  new Platform(1000, 600, 100, 20),
  new Platform(1200, 700, 100, 20),
  new Platform(1400, 800, 100, 20),
];

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

let scrollOffset = 0;

function animate() {
  requestAnimationFrame(animate);
  context.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  platforms.forEach((platform) => {
    platform.draw();
  });

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = 5;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      scrollOffset += 5;
      platforms.forEach((platform) => {
        platform.position.x -= 5;
      });
    } else if (keys.left.pressed) {
      scrollOffset -= 5;
      platforms.forEach((platform) => {
        platform.position.x += 5;
      });
    }
  }

  console.log(scrollOffset);

  //detect platform collision
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });
  if (scrollOffset > 3000) {
    console.log("YOU WIN");
  }
}
animate();

window.addEventListener("keydown", ({ key }) => {
  const lowercaseKey = key.toLowerCase();

  switch (lowercaseKey) {
    // W - JUMP
    case "w":
      console.log("jump");
      player.velocity.y -= 20;
      break;
    // A - LEFT
    case "a":
      console.log("left");
      keys.left.pressed = true;
      break;
    // S - DOWN
    case "s":
      console.log("down");
      break;
    // D - RIGHT
    case "d":
      console.log("right");
      keys.right.pressed = true;
      break;
  }
});

window.addEventListener("keyup", ({ key }) => {
  const lowercaseKey = key.toLowerCase();

  switch (lowercaseKey) {
    // W - JUMP
    case "w":
      console.log("jump");
      player.velocity.y = 1;
      break;
    // A - LEFT
    case "a":
      console.log("left");
      keys.left.pressed = false;
      break;
    // S - DOWN
    case "s":
      console.log("down");
      break;
    // D - RIGHT
    case "d":
      console.log("right");
      keys.right.pressed = false;
      break;
  }
});
