posPerCharX = 8;
posPerCharY = 4;

const fileUrl = '/scripts/Map/01.txt';

// Fetch the file content using the Fetch API
fetch(fileUrl)
.then(response => {
if (!response.ok) {
    throw new Error('Network response was not ok');
}
return response.text();
})
.then(textContent => {
// Process the file content here
console.log(textContent);
const MapSplit = textContent.split('\n');
console.log(MapSplit.length);
j = 0;
const map = [[], [], [], [], [], [], [], []];
var PlatformStart = 0;
MapSplit.forEach((MapLine) => {
    for(var i = 0; i <= MapLine.length; i++){
        map[j][i] = MapLine.charAt(i);
        switch(MapLine.charAt(i)){
            case ' ':
                break;
            case 'x':
                if(map[j][i-1] === ' '){
                    PlatformStart = i * posPerCharY;
                    break;
                }
                if(map[j][i+1] === 'x'){
                    break;
                }
                else{
                    if(map[j][i-1] === ' '){
                        PlatformStart = i * posPerCharY;
                    }
                }
        }
    }
    j++;
})
console.log(map);
})
.catch(error => {
console.error('Error while fetching the file:', error);
});

function Map2Platforms(map){
    map.forEach((mapLine) => {
      console.warn(mapLine);
    })
}
Map2Platforms(map);
