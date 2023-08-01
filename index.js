const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.7;

/////////////////////images////////////////////////
function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}

const ground = document.createElement("img");
ground.src = "img/desert_ground.png";

const background = document.createElement("img");
background.src = "img/background.jpg";

//////////////////character sprites////////////////////
const runRight = document.createElement("img");
runRight.src = "img/RunRight.png";
const jumpRight = document.createElement("img");
jumpRight.src = "img/JumpRight.png";

const jumpLeft = document.createElement("img");
jumpLeft.src = "img/JumpLeft.png";
const runLeft = document.createElement("img");
runLeft.src = "img/RunLeft.png";

class GenericObject {
  constructor(x, y, width, height, image) {
    this.position = {
      x: -1,
      y: -1,
    };
    this.width = width;
    this.height = height;
    this.image = image;
  }
}

const genericObjects = [new GenericObject(0, 0, 0, 0, background)];
///////////////////////////////////////////////////

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
    this.width = 50;
    this.height = 100;

    this.image = createImage("img/RunRight.png");
  }

  draw() {
    context.drawImage(
      this.image,
      0,
      0,
      70,
      400,
      this.position.x,
      this.position.y,
      100,
      400
    );
  }

  update() {
    this.frames++;
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
  constructor(x, y, image) {
    this.position = {
      x: x,
      y: y,
    };
    this.image = image;
    this.width = 200; // Initially set to 0
    this.height = 0; // Initially set to 0

    // Add onload event to set the dimensions once the image is loaded
    this.image.onload = () => {
      this.width = this.image.width;
      this.height = this.image.height;
    };
  }

  draw() {
    context.drawImage(this.image, this.position.x, this.position.y);
  }
}

const player = new Player();
const platforms = [];
const platform = new Platform(600, 1070, ground);
platforms.push(platform);

const groundPlatforms = [];

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
  genericObjects.forEach((object) => {
    context.drawImage(object.image, 0, 0);
  });
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
  // Detect platform collision
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.y + player.velocity.y <=
        platform.position.y + platform.height &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width &&
      player.velocity.y > 0
    ) {
      player.velocity.y = 0;
      player.position.y = platform.position.y - player.height; // Reset player position to be on top of the platform
    }
  });

  if (scrollOffset > 3000) {
    console.log("YOU WIN");
  }
  if (player.velocity.y === 0) {
    if (player.image === jumpRight) {
      player.image = runRight;
    } else if (player.image === jumpLeft) {
      player.image = runLeft;
    }
  }
}
renderGround(20);
animate();

window.addEventListener("keydown", ({ key }) => {
  const lowercaseKey = key.toLowerCase();

  switch (lowercaseKey) {
    // W - JUMP
    case "w":
      console.log("jump");
      if (player.image === runRight) {
        player.image = jumpRight;
      } else {
        player.image = jumpLeft;
      }
      player.velocity.y -= 20;
      break;
    // A - LEFT
    case "a":
      console.log("left");
      player.image = runLeft;
      keys.left.pressed = true;
      break;
    // S - DOWN
    case "s":
      console.log("down");
      break;
    // D - RIGHT
    case "d":
      console.log("right");
      player.image = runRight;
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

function renderGround(num) {
  let count = 0;
  for (let i = 0; i < num; i++) {
    platforms.push(new Platform(count, 1110, ground));
    count += 200;
  }
}
