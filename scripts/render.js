const fileUrl = '/scripts/Map/01.txt';

// Fetch the file content using the Fetch API
game = document.getElementById("game");
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
    MapSplit.forEach((MapLine) => {
        document.write(MapLine + '<br>');
    })
  })
  .catch(error => {
    console.error('Error while fetching the file:', error);
  });