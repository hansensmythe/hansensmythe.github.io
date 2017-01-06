var qwirkleSize = 6;
var colours = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple'];
var shapes = ['Circle', 'Diamond', 'Flower', 'Nunchuck', 'Square', 'Star'];
var tiles = {};
var isImageEnabled = true;
var maxTileAttempts = 10;
var maxFillAttempts = 25;
var updateDate = "21 April 2015";

function Tile(c, s) {
  this.c = c;
  this.s = s;
  this.isAvailable = true;
}

Tile.prototype.toString = function() {
  return colours[this.c] + ' ' + shapes[this.s];
};

Tile.prototype.getElement = function() {
  // returns element representing this tile
  var tileElement;
  if (isImageEnabled) {
    tileElement = document.createElement("img");
    tileElement.src = "tiles/t" + this.c + this.s + ".png";
  } else {
    tileElement = document.createTextNode(this.toString());
  }
  return tileElement;
};

function getColourIndex(qwirkle, c) {
  var colourIndex = -1;
  for (var i = 0; i < qwirkle.length && colourIndex === -1; i++) {
    if (qwirkle[i].c === c) {
      colourIndex = i;
    };
  }
  return colourIndex;
}

function getShapeIndex(qwirkle, s) {
  var shapeIndex = -1;
  for (var i = 0; i < qwirkle.length && shapeIndex === -1; i++) {
    if (qwirkle[i].s === s) {
      shapeIndex = i;
    };
  }
  return shapeIndex;
}

function getQwirkleIndex(tile) {
  var qwirkleIndex = -1;
  for (var q = 0; q < qwirkles.length && qwirkleIndex === -1; q++) {
    qwirkleIndex = qwirkles[q].indexOf(tile);
  }
  return qwirkleIndex;
}

function findRandomTile(qwirkle, availableColours, availableShapes) {
  // If the qwirkle is empty, we just need to find one that is not already used anywhere.
  // If the qwirkle already has members, make sure the new one creates no duplicates
  if (!availableColours) {
    availableColours = [];
    for (var i = 0; i < qwirkleSize; i++) {
      if (getColourIndex(qwirkle, i) === -1) {
        availableColours.push(i);
      }
    }
  }
  if (!availableShapes) {
    availableShapes = [];
    for (var i = 0; i < qwirkleSize; i++) {
      if (getShapeIndex(qwirkle, i) === -1) {
        availableShapes.push(i);
      }
    }
  }
  var newTile = null;
  if (availableColours.length === 1 && availableShapes === 1) {
    // we don't need random - we know exactly what it should be.
    var targetTile = tiles[availableColours[0]][availableShapes[0]];
    if (targetTile.isAvailable) {
      newTile = targetTile;
    } else {
      // All right! Who has my tile? Can we trade? So long as it's not the 1st or 2nd item, it should be safe
      // However, this code never seems to succeed. TODO: analyze why and fix it.
      /*
      var qwirkleIndex = getQwirkleIndex(targetTile);
      var tileIndex = qwirkles[qwirkleIndex].indexOf(targetTile);
      if (tileIndex > 1) {
        qwirkles[qwirkleIndex].splice(tileIndex, 1);
        console.log("I stole " + targetTile.toString() + " from " + qwirkles[qwirkleIndex].toString());
        newTile = targetTile;
        if (!fillQwirkle(qwirkles[qwirkleIndex])) {
          console.log("I tried stealing a tile, but then I couldn't finish the qwirkle from which I stole it.");
          return null;
        }
      }
      */
    }
  } else {
    // The more populated the qwirkle is, the narrower the choices. If we don't have an
    // available tile in maxTileAttempts tries, there's probably a programming error and we should give up.
    for (var i = 0; i < maxTileAttempts && !newTile; i++) {
      var randomC = availableColours[Math.floor(Math.random() * availableColours.length)];
      var randomS = availableShapes[Math.floor(Math.random() * availableShapes.length)];
      if (tiles[randomC][randomS].isAvailable) {
        // so far so good, but does it work with what we already have?
        newTile = tiles[randomC][randomS];
      }
    }
  }
  return newTile;
}

function consumeTile(qwirkle, tile) {
  if (tile.isAvailable) {
    qwirkle.push(tile);
    tile.isAvailable = false;
    return true;
  } else {
    return false;
  }
}

function fillQwirkle(qwirkle) {
  var isValid = true;
  while (qwirkle.length < qwirkleSize && isValid) {
    var newTile = findRandomTile(qwirkle);
    if (newTile) {
      isValid = consumeTile(qwirkle, newTile);
    } else {
      isValid = false;
    }
  }
  return isValid;
}

function forbidKittycorners(tempArray, qwirkle) {
  [tiles[qwirkle[0].c][qwirkle[1].s], tiles[qwirkle[1].c][qwirkle[0].s]].forEach(function(tile) {
    if (tile.isAvailable) {
      tempArray.push(tile);
      tile.isAvailable = false;
    }
  });
}

function fill() {
  for (var c = 0; c < colours.length; c++) {
    tiles[c] = {};
    for (var s = 0; s < shapes.length; s++) {
      tiles[c][s] = new Tile(c, s);
    }
  }

  var qwirkles = [[], [], [], []];
  var temporarilyUnavailable = [];
  // Fill the first two tiles of each qwirkle, making sure they allow a cenral qwirkle
  consumeTile(qwirkles[0], findRandomTile(qwirkles[0]));
  consumeTile(qwirkles[0], findRandomTile(qwirkles[0]));
  forbidKittycorners(temporarilyUnavailable, qwirkles[0]);
  // The second qwirkle should match the first by colour
  consumeTile(qwirkles[1], findRandomTile(qwirkles[1], [qwirkles[0][0].c]));
  consumeTile(qwirkles[1], findRandomTile(qwirkles[1], [qwirkles[0][1].c]));
  forbidKittycorners(temporarilyUnavailable, qwirkles[1]);
  // The third qwirkle should match the first by shape
  consumeTile(qwirkles[2], findRandomTile(qwirkles[2], null, [qwirkles[0][0].s]));
  consumeTile(qwirkles[2], findRandomTile(qwirkles[2], null, [qwirkles[0][1].s]));
  // The fourth qwirkle starts with two tiles we know exactly
  consumeTile(qwirkles[3], tiles[qwirkles[2][0].c][qwirkles[1][0].s]);
  consumeTile(qwirkles[3], tiles[qwirkles[2][1].c][qwirkles[1][1].s]);

  temporarilyUnavailable.forEach(function(tile) {
    tile.isAvailable = true;
  });

  // We need to get completely valid qwirkles before we start drawing to the screen. Easier that than clearing and repopulating
  var isValid = true;
  qwirkles.forEach(function(qwirkle) {
    if (!fillQwirkle(qwirkle)) {
      isValid = false;
    }
  });

  if (isValid) {
    // Draw images to table. We don't use forEach because we need the indexes to find the corresponding element
    for (var i = 0; i < qwirkles.length; i++) {
      isValid = fillQwirkle(qwirkles[i]);
      for (var j = 0; j < qwirkles[i].length; j++) {
        var tile = qwirkles[i][j];
        var tileElement = tile.getElement();
        var cell = document.getElementById('q' + i + j);
        cell.appendChild(tileElement);
      }
    }
    finish();
    return true;
  } else {
    console.log("Failed to fill qwirkle - last tile was both necessary and unavailable");
  }
}

function finish() {
  var unused = document.getElementById("unused");
  unused.appendChild(document.createTextNode("Unused tiles: "));
  for (var c = 0; c < colours.length; c++) {
    for (var s = 0; s < shapes.length; s++) {
      if (tiles[c][s].isAvailable) {
        unused.appendChild(tiles[c][s].getElement());
      }
    }
  }
  var updated = document.getElementById("updated");
  updated.innerHTML = updateDate;
}

// Called from setup.html
function loadQwirkleConnect() {
  // try maxFillAttempts times. If it's not possible in that many, there's probably a programming error and we should stop trying
  var isInitialized = false;
  for (var i = 0; i < maxFillAttempts && !isInitialized; i++) {
    console.log("Populating Qwirkle Connect board (try #" + (i + 1) + ")");
    isInitialized = fill();
  }
  if (!isInitialized) {
    var unused = document.getElementById("unused");
    var message = document.createTextNode("We came, we saw, but we failed to conquer. Check console log for error.");
    unused.appendChild(message);
  }
}
