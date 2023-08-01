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
    var game = document.getElementById('game');
    j = 0;
    const map = [[], [], [], [], [], [], [], []];
    MapSplit.forEach((MapLine) => {
        game.innerHTML += MapLine + '<br>';
        for(var i = 0; i <= MapLine.length; i++){
            map[j][i] = MapLine.charAt(i);
        }
        j++;
    })
    console.log(map);
  })
  .catch(error => {
    console.error('Error while fetching the file:', error);
  });