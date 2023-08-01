console.log("test");

document.addEventListener('keydown', (event) => {
    var name = event.key;
    switch(name){
        case 'w':
            console.log("jump");
            break;
        case 'a':
            console.log("left");
            break;
        case 'd':
            console.log("right");
            break;
    }
  }, false);