// These colours and shapes must correspond with the filenames in the tiles folder
// e.g. tiles/RedCircle.png is found by concatenating COLOURS[0] and SHAPES[0]
const COLOURS = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple'];
const SHAPES = ['Circle', 'Diamond', 'Eightstar', 'Flower', 'Fourstar', 'Square'];
const USEIMAGES = true;
const MAXFILLS = 500;
const UPDATEDATE = "11 September 2022";

class Tile {
    constructor(colour, shape) {
        this.colour = colour;
        this.shape = shape;
        this.isUsed = false;
    }
    setUsed() {
        this.isUsed = true;
    }
    isAvailable() {
        return !this.isUsed;
    }
    toString() {
        return `${this.colour}${this.shape}`;
    }
    getElement() {
        // Returns element representing this tile
        let tileElement;
        if (USEIMAGES) {
            tileElement = document.createElement("img");
            tileElement.src = `tiles/${this.toString()}.png`;
        } else {
            tileElement = document.createTextNode(this.toString());
        }
        return tileElement;
    }
}

class BagOfTiles {
    constructor() {
        this.tiles = [];
        COLOURS.forEach((colour) => {
            SHAPES.forEach((shape) => {
                this.tiles.push(new Tile(colour, shape));
            });
        });
    }
    getAvailableTiles() {
        return this.tiles.filter((tile) => tile.isAvailable());
    }
    getRandomTile(availableColours, availableShapes) {
        // From the available tiles, further restrict the possibilities to conform to the provided arrays of available values
        const availableTiles = this.getAvailableTiles().filter((tile) => availableColours.includes(tile.colour) && availableShapes.includes(tile.shape));
        if (availableTiles.length === 0) {
            throw new Error('Ran out of legal tiles');
        }
        const randomIndex = Math.floor(Math.random() * availableTiles.length);
        const drawnTile = availableTiles[randomIndex];
        drawnTile.setUsed();
        return drawnTile;
    }
}

class Qwirkle {
    constructor(index) {
        this.index = index;
        this.tiles = {};
    }
    getColours() {
        return Object.values(this.tiles).map((tile) => tile.colour);
    }
    getShapes() {
        return Object.values(this.tiles).map((tile) => tile.shape);
    }
    getAvailableColours() {
        return COLOURS.filter((colour) => !this.getColours().includes(colour));
    }
    getAvailableShapes() {
        return SHAPES.filter((shape) => !this.getShapes().includes(shape));
    }
    isAvailableColour(tileToMatch) {
        return this.getAvailableColours().includes(tileToMatch.colour);
    }
    isAvailableShape(tileToMatch) {
        return this.getAvailableShapes().includes(tileToMatch.shape);
    }
    addTile(position, drawnTile) {
        this.tiles[position] = drawnTile;
    }
    addRandomTile(bagOfTiles, position) {
        return this.addTile(position, bagOfTiles.getRandomTile(this.getAvailableColours(), this.getAvailableShapes()));
    }
    addTileOfColour(bagOfTiles, position, tileToMatch) {
        if (this.isAvailableColour(tileToMatch)) {
            return this.addTile(position, bagOfTiles.getRandomTile([tileToMatch.colour], this.getAvailableShapes()));
        }
        // If the colour of the tile to match already exists, there is no tile that we can return
        throw new Error(`Colour to match (${tileToMatch.colour}) already exists in quirkle[${this.index}]`);
    }
    addTileOfShape(bagOfTiles, position, tileToMatch) {
        if (this.isAvailableShape(tileToMatch)) {
            return this.addTile(position, bagOfTiles.getRandomTile(this.getAvailableColours(), [tileToMatch.shape]));
        }
        // If the shape of the tile to match already exists, there is no tile that we can return
        throw new Error(`Shape to match (${tileToMatch.shape}) already exists in quirkle[${this.index}]`);
    }
    populateBoard() {
        Object.keys(this.tiles).forEach((position) => {
            // For each position, find the matching spot on the board.
            // For example, quirkle index=2 with tile position=3 would retrieve document element q23
            const tileElement = this.tiles[position].getElement();
            const cell = document.getElementById(`q${this.index}${position}`);
            cell.appendChild(tileElement);
        });
    }
}

/**
 * 
 * @param {number} tryCount - Used only for logging a message so that we can document how many times we've tried
 * @returns 
 */
function fill(tryCount) {
    const bagOfTiles = new BagOfTiles();
    const qNE = new Qwirkle(0);
    const qSE = new Qwirkle(1);
    const qSW = new Qwirkle(2);
    const qNW = new Qwirkle(3);
    // Create qwirkles starting from the top, going clockwise, with one qwirkle per quadrant, where the last two tiles of the previous
    // qwirkle complement the first two tiles of the next qwirkle. Try to get the quirkles connected up, then try to fill the middles.
    // If at any time we run out of legal tiles, an error will be thrown and we stop and try again.
    try {
        qNE.addRandomTile(bagOfTiles, 0);
        qNE.addRandomTile(bagOfTiles, 1);
        qNE.addRandomTile(bagOfTiles, 4);
        qNE.addRandomTile(bagOfTiles, 5);
        qSE.addTileOfColour(bagOfTiles, 0, qNE.tiles[5]);
        qSE.addTileOfColour(bagOfTiles, 1, qNE.tiles[4]);
        qSE.addRandomTile(bagOfTiles, 4);
        qSE.addRandomTile(bagOfTiles, 5);
        qSW.addTileOfShape(bagOfTiles, 0, qSE.tiles[5]);
        qSW.addTileOfShape(bagOfTiles, 1, qSE.tiles[4]);
        qSW.addRandomTile(bagOfTiles, 4);
        qSW.addRandomTile(bagOfTiles, 5);
        qNW.addTileOfColour(bagOfTiles, 0, qSW.tiles[5]);
        qNW.addTileOfColour(bagOfTiles, 1, qSW.tiles[4]);
        qNW.addTileOfShape(bagOfTiles, 4, qNE.tiles[1]);
        qNW.addTileOfShape(bagOfTiles, 5, qNE.tiles[0]);

        // We've defined the circle of qwirkles! Fill in the middle tiles
        qNE.addRandomTile(bagOfTiles, 2);
        qNE.addRandomTile(bagOfTiles, 3);
        qSE.addRandomTile(bagOfTiles, 2);
        qSE.addRandomTile(bagOfTiles, 3);
        qSW.addRandomTile(bagOfTiles, 2);
        qSW.addRandomTile(bagOfTiles, 3);
        qNW.addRandomTile(bagOfTiles, 2);
        qNW.addRandomTile(bagOfTiles, 3);
    } catch (err) {
        console.log(`Error: ${err.message} on try ${tryCount}`);
        return false;
    }

    // If we got here, we successfully filled the quirkles
    qNE.populateBoard();
    qSE.populateBoard();
    qSW.populateBoard();
    qNW.populateBoard();
    const unusedElement = document.getElementById("unused");
    bagOfTiles.getAvailableTiles().forEach((unusedTile) => unusedElement.appendChild(unusedTile.getElement()));
    unusedElement.appendChild(document.createTextNode(" unused"));
    const updatedElement = document.getElementById("updated");
    updatedElement.innerHTML = UPDATEDATE;
    return true;
}

// Called from setup.html
function loadQwirkleConnect() {
    // try MAXFILLS times. If it's not possible in that many, there's probably a programming error and we should stop trying
    let isInitialized = false;
    for (let tryCount = 1; tryCount <= MAXFILLS && !isInitialized; tryCount++) {
        isInitialized = fill(tryCount);
    }
    if (!isInitialized) {
        const unused = document.getElementById("unused");
        const message = document.createTextNode("We came, we saw, but we failed to conquer. Check console log for error.");
        unused.appendChild(message);
    }
}
  
