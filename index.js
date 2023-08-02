const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const popup = document.getElementById("popup");
var gameover = false;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let scrollOffset = 0;

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
/////////////////Enemy sprites/////////////////////////
const fishA = document.createElement("img");
fishA.src = "img/FishA.png";
const fishB = document.createElement("img");
fishB.src = "img/FishB.png";
const fishC = document.createElement("img");
fishC.src = "img/FishC.png";
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
const enemies = [];
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
    this.isJumping = false;
    this.image = createImage("img/RunRight.png");
  }

  draw() {
    if (!gameover) {
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
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
      this.isJumping = false; // Set isJumping to false when the player lands
    }

    const isOnGround = this.position.y + this.height >= canvas.height;

    if (!isOnGround) {
      this.isJumping = false;
    }
  }
}

class Enemy {
  constructor() {
    this.position = {
      x: canvas.width,
      y: Math.random() * (canvas.height - 100), // Random height for the enemy
    };
    this.velocity = {
      x: Math.random() * -5 - 2, // Random horizontal velocity between -2 and -7
      y: 0, // No vertical velocity
    };
    this.width = 35;
    this.height = 35;
    this.image = getRandomEnemyImage();
  }

  draw() {
    context.drawImage(
      this.image,
      0,
      0,
      450,
      450,
      this.position.x,
      this.position.y,
      50,
      50
    );
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

function getRandomEnemyImage() {
  const random = Math.random();
  if (random < 0.33) {
    return createImage("img/FishA.png");
  } else if (random < 0.66) {
    return createImage("img/FishB.png");
  } else {
    return createImage("img/FishC.png");
  }
}

/////////////////////////PLATFORM//////////////////////////
class imgPlatform {
  constructor(x, y, image) {
    this.position = {
      x: x,
      y: canvas.height - y,
    };
    this.image = image;
    this.width = 200;
    this.height = 0;

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
class deathBox {
  constructor(x, y, width, height) {
    this.position = {
      x: x,
      y: canvas.height - y,
    };
    this.width = width;
    this.height = height;
  }

  draw() {
    context.fillStyle = "transparent";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class WinCondition {
  constructor(x, y, width, height) {
    this.position = {
      x: x,
      y: canvas.height - y,
    };
    this.width = width;
    this.height = height;
  }
  draw() {
    context.fillStyle = "green";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const player = new Player();

const platforms = [];

const groundPlatforms = [];

const deathboxes = [new deathBox(500, 10, 60000, 10)];
const newWin = new WinCondition(5900, 60, 60, 40);

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

function getCurTimeDifference(end, start) {
  const time = start.getTime() - end.getTime();
  return time;
}

function setCookie(score) {
  //set a cookie
  document.cookie = "score=" + score;
  //get a cookie
  const cookieValue = document.cookie;
  console.log(cookieValue);
}

function animate() {
  const timestart = new Date().getTime();
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
  }

  if (keys.right.pressed) {
    scrollOffset += 5;
    platforms.forEach((platform) => {
      platform.position.x -= 5;
    });
    deathboxes.forEach((deathbox) => {
      deathbox.position.x -= 5;
    });
    newWin.position.x -= 5;
  } else if (keys.left.pressed) {
    scrollOffset -= 5;
    platforms.forEach((platform) => {
      platform.position.x += 5;
    });
    deathboxes.forEach((deathbox) => {
      deathbox.position.x += 5;
    });
    newWin.position.x += 5;
  }

  // Detect platform collision
  newWin.draw();

  if (
    player.position.y + player.height <= newWin.position.y &&
    player.position.y + player.height + player.velocity.y >=
      newWin.position.y &&
    player.position.x + player.width >= newWin.position.x &&
    player.position.x <= newWin.position.x + newWin.width
  ) {
    player.velocity.y = 0;
    //location.reload()
    const score = 100000;
    //setCookie(score);
    alert("You win!");
    gameOverNow();
  }

  platforms.forEach((platform) => {
    platform.draw();
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

    if (player.velocity.y === 0) {
      if (player.image === jumpRight) {
        player.image = runRight;
      } else if (player.image === jumpLeft) {
        player.image = runLeft;
      }
    }
  });

  /////ENEMENIES & PLATFORMS/////////////////////////////////
  if (Math.random() < 0.02) {
    enemies.push(new Enemy());
  }
  // Spawn random ground platform
  if (Math.random() < 0.03) {
    createRandomGroundPlatform();
  }

  // Update and draw enemies
  enemies.forEach((enemy) => {
    enemy.update();
    enemy.draw();

    // Check for collision with player
    if (
      player.position.x < enemy.position.x + enemy.width &&
      player.position.x + player.width > enemy.position.x &&
      player.position.y < enemy.position.y + enemy.height &&
      player.position.y + player.height > enemy.position.y
    ) {
      // Handle collision with enemy (e.g., game over, reduce player's health, etc.)
      console.log("Collision with enemy!");
      gameOverNow();
    }

    // Remove enemies that have gone off the screen
    if (enemy.position.x + enemy.width < 0) {
      const enemyIndex = enemies.indexOf(enemy);
      if (enemyIndex !== -1) {
        enemies.splice(enemyIndex, 1);
      }
    }
  });

  ///////////////////////////////////////////////

  deathboxes.forEach((deathbox) => {
    deathbox.draw();
    if (
      player.position.y + player.height <= deathbox.position.y &&
      player.position.y + player.height + player.velocity.y >=
        deathbox.position.y &&
      player.position.x + player.width >= deathbox.position.x &&
      player.position.x <= deathbox.position.x + deathbox.width
    ) {
      player.velocity.y = 0;
      //location.reload()
      const score = getScore();
      const endtime = new Date().getTime();
      const TimeAlive = endtime - timestart;
      //location.reload()

      alert("time Alive: " + TimeAlive + " Your Score: " + score);
      gameOverNow();
      //alert("Your Score: " + score);
      //openPopup();
    }
  });
}
renderGround(200);
animate();

function gameOverNow() {
  gameover = true;
  updateLeaderboard();
  alert("Game Over");
  setTimeout(restartGame, 10);
}

function updateLeaderboard() {
  const score = getScore();
  const scoreElement = (document.getElementById("leaderboard").innerHTML =
    score);
  scoreElement.textContent = "Last Score: " + score;
}

function getScore() {
  const score = player.position.x / 2;
  return score;
}

window.addEventListener("keydown", ({ key }) => {
  const lowercaseKey = key.toLowerCase();
  switch (lowercaseKey) {
    // W - JUMP
    case "w":
      // Only allow jumping if the player is on the ground
      if (!player.isJumping && player.velocity.y === 0) {
        console.log("jump");
        player.isJumping = true;
        if (player.image === runRight) {
          player.image = jumpRight;
        } else {
          player.image = jumpLeft;
        }
        player.velocity.y -= 20;
      }
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
    // Generate a random number between 0 and 1
    const skipProbability = Math.random();

    if (skipProbability < 0.2) {
      // Skip creating a platform for this segment (20% chance of skipping)
      count += 200; // Increase the count to move to the next segment without creating a platform
    } else {
      // Create a platform for this segment
      platforms.push(new imgPlatform(count, 35, ground));
      count += 200; // Increase the count to move to the next segment
    }
  }
}

function openPopup() {
  popup.style.display = "block";
}

function closePopup() {
  popup.style.display = "none";
  location.reload();
}

let animationFrameId = null;

function restartGame() {
  gameover = false;
  player.position.x = 0;
  player.position.y = 0;
  player.velocity.x = 0;
  player.velocity.y = 0;
  player.image = runRight;
  scrollOffset = 0;
  // Cancel the previous animation frame request
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }

  // Start a new animation loop
  animationFrameId = requestAnimationFrame(animate);
}

function createRandomGroundPlatform() {
  const x = canvas.width; // Start the platform outside the canvas on the right
  const y = canvas.height - Math.random() * 2000; // Random height for the platform (adjust 200 to set the maximum height)
  const width = Math.random() * 150 + 50; // Random width between 50 and 200
  const height = 20; // Fixed height for ground platforms

  const newPlatform = new imgPlatform(x, y, ground);
  platforms.push(newPlatform);
}
