const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const popup = document.getElementById('popup');
var gameover = false;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var rightSideCollision = false;
var leftSideCollision = false;
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
    if(!gameover){
    context.fillStyle = "red";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
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
const platforms = [
  new Platform(0, 80, 500, 80),
  new Platform(700, 200, 75, 20),
  new Platform(1000, 350, 75, 20),
  new Platform(1100, 80, 250, 80),
  new Platform(1275, 250, 75, 20),
  new Platform(1350, 400, 300, 400)
]
const deathboxes = [
  new deathBox(500, 40, 600, 40)

]
const newWin = new WinCondition(505, 60, 60, 40)

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

function setCookie(score, outcome) {
    const date = new Date() + 1;
    document.cookie = `score=${score}; outcome=${outcome}; expires=${date}`;
    //alert(document.cookie)
    console.log(document.cookie)
  }
  


const leaderboard = [1, 2, 3]
function animate() {
  const timestart = new Date().getTime();
  requestAnimationFrame(animate);
  context.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  if (keys.right.pressed && player.position.x < 400 && !rightSideCollision) {
    player.velocity.x = 4;
  }
  else if (keys.left.pressed && player.position.x > 100 && !leftSideCollision) {
    player.velocity.x = -4;
  }
  else {
    player.velocity.x = 0;
  }
  if (keys.right.pressed && !rightSideCollision) {
    scrollOffset += 4;
    platforms.forEach((platform) => {
      platform.position.x -= 4;
    });
    deathboxes.forEach((deathbox) =>{
      deathbox.position.x -= 4;
    });
  } else if (keys.left.pressed && !leftSideCollision) {
    scrollOffset -= 4;
    platforms.forEach((platform) => {
      platform.position.x += 4;
    });
    deathboxes.forEach((deathbox) =>{
      deathbox.position.x += 4;
    })
    
    newWin.position.x -= 5;
      
  }
  //detect platform collision
  newWin.draw();
  
    if (
      player.position.y + player.height <= newWin.position.y &&
      player.position.y + player.height + player.velocity.y >=
        newWin.position.y &&
      player.position.x + player.width >= newWin.position.x &&
      player.position.x <= newWin.position.x + newWin.width
    ) {
      player.velocity.y = 0;
      
      const playerScore = 1000000;
        const outcome = "win";
        //setCookie(playerScore, outcome);
      //location.reload()
      alert("You win! Your score: " + playerScore)
     // setCookie(test, score)

    }
  platforms.forEach((platform) => {
    platform.draw();
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >= platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }

// Horizontal Collision Check  
    if (
      player.position.y + player.height >= platform.position.y &&     
      player.position.y <= platform.position.y + platform.height
    ){
      if(player.position.x + player.width >= platform.position.x && player.position.x + player.width <= platform.position.x + player.velocity.x){
        console.log("right side collision");
        rightSideCollision = true;
      }
      else{
        rightSideCollision = false;
      }
      if(player.position.x <= platform.position.x + platform.width && player.position.x >= platform.position.x + platform.width + player.velocity.x){
        console.log("left side collision");
        leftSideCollision = true;
      }
      else{
        leftSideCollision = false
      }
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
      location.reload()
      
      alert("time Alive: " + TimeAlive +" Your Score: " + score)
      gameOverNow();
      //alert("Your Score: " + score);
      //openPopup();
      
    }
  })
}
animate();

function gameOverNow(){
    gameover = true;
}
function displayScore(){
    const scoreElement = document.getElementById("score");
    
    score.textContent = `Constant Value: ${scoreElement}`;
}
displayScore();

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


