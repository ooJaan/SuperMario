const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const popup = document.getElementById('popup');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.7;

/////////////////////images////////////////////////
const ground = document.createElement("img");
ground.src = "img/desert_ground.png";

console.log(ground);
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
  constructor(x, y, image) {
    this.position = {
      x: x,
      y: canvas.height - y,
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
      context.fillStyle = "red";
      context.fillRect(this.position.x, this.position.y, this.width, this.height);
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

function getCurTimeDifference(end, start){
    const time = start.getTime() - end.getTime()
    return time;
}


function animate() {
 const timestart = new Date().getTime();
  requestAnimationFrame(animate);
  context.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  platform.draw();
  deathbox.draw();
  if (keys.right.pressed) {
    player.velocity.x = 5;
  } else if (keys.left.pressed) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;
  }

  //detect platform collision
  if (
    player.position.y + player.height <= platform.position.y &&
    player.position.y + player.height + player.velocity.y >=
      platform.position.y &&
    player.position.x + player.width >= platform.position.x &&
    player.position.x <= platform.position.x + platform.width
  ) {
    player.velocity.y = 0;
  }

  if (
    player.position.y + player.height <= deathbox.position.y &&
    player.position.y + player.height + player.velocity.y >=
      deathbox.position.y &&
    player.position.x + player.width >= deathbox.position.x &&
    player.position.x <= deathbox.position.x + deathbox.width
  ) {
    player.velocity.y = 0;
    //location.reload()
    const score = player.position.x / 2
    const endtime = new Date().getTime();
    const TimeAlive = endtime - timestart;
    //alert("time Alive: " + TimeAlive +" Your Score: " + score)
    //alert("Your Score: " + score);
    openPopup();
    if (scrollOffset > 3000) {
        console.log("YOU WIN");
    
  }
}}
renderGround(20);
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


function openPopup() {
    popup.style.display = 'block';
  }
  
  function closePopup() {
    popup.style.display = 'none';
    event.preventDefault();
    location.reload();
  }
  function renderGround(num) {
    let count = 0;
    for (let i = 0; i < num; i++) {
      platforms.push(new Platform(count, 1110, ground));
      count += 200;
    }
  }
