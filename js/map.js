// map constructor function to create map tile board with obstacles
var Map = function(mapSize) {
    this.mapSize = mapSize;

    this.create  = function() {
        for (let i = 0; i <= mapSize; i += 1) {
        mapContainer.append('<li class="box" data-index="' + i + '"></li>');
        let numTiles = $('.box').length;
        tiles.push(numTiles);
        }
    }
    this.obstacles = function(itemClass) {
        addComponents(itemClass)
    }
}

// create game map object
let game = new Map(mapSize);

