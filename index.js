const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const popup = document.getElementById('popup');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let scrollOffset = 0;

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
const platforms = [
  new Platform(0, 80, 500, 80),
  new Platform(700, 200, 75, 20),
  new Platform(900, 350, 75, 20),
]
const deathboxes = [
  new deathBox(500, 40, 600, 40)

]

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
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = 5;
  }
  else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -5;
  }
  else {
    player.velocity.x = 0;
  }
  if (keys.right.pressed) {
    scrollOffset += 5;
    platforms.forEach((platform) => {
      platform.position.x -= 5;
    });
    deathboxes.forEach((deathbox) =>{
      deathbox.position.x -= 5;
    });
  } else if (keys.left.pressed) {
    scrollOffset -= 5;
    platforms.forEach((platform) => {
      platform.position.x += 5;
    });
    deathboxes.forEach((deathbox) =>{
      deathbox.position.x += 5;
    })
  }
  console.log(scrollOffset);

  //detect platform collision
  platforms.forEach((platform) => {
    platform.draw();
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  })
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
      const score = player.position.x / 2
      const endtime = new Date().getTime();
      const TimeAlive = endtime - timestart;
      //alert("time Alive: " + TimeAlive +" Your Score: " + score)
      //alert("Your Score: " + score);
      openPopup();
      
    }
  })
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


function openPopup() {
    popup.style.display = 'block';
  }
  
  function closePopup() {
    popup.style.display = 'none';
    event.preventDefault();
    location.reload();
  }


