// selectedPieces needs to be global so it can be set by selectPieces
// but then used separately to sort the selected pieces
let selectedPieces = [];

class Sorter {
    /**
     * The Sorter provides a sort function that the selectedPieces array can use to sort itself,
     * and also provides header text depending on the current sort direction.
     * @param {string} sortKey - Key to the music.html header element for this type of sort, and also to the field in the piece on which this Sorter sorts
     * @param {string} sortText - Value to display in the header, with up or down arrow appended depending on direction
     * @param {number} initialDirection -  1 ascending, -1 descending, 0 disabled
     */
    constructor(sortKey, sortText, initialDirection) {
        this.key = sortKey;
        this.text = sortText;
        this.direction = initialDirection;
    }
    
    toggleDirection() {
        if (this.direction === 0) {
            // Assume a default ascending direction
            this.direction = 1;
        } else {
            // Flip asc and desc
            this.direction *= -1;
        }
    }

    clearDirection() {
        this.direction = 0;
    }

    setHeaderText() {
        const node = document.getElementById(this.key);
        node.innerHTML = this.direction === 1 ? `${this.text} &uarr;` : this.direction === -1 ? `${this.text} &darr;` : this.text;
    }
}

const durSorter = new Sorter("duration", "Duration", 0);
const titleSorter = new Sorter("title", "Title", 0);
const dateSorter = new Sorter("year", "Year", -1);
// Use dateSorter as a default
let currentSorter = dateSorter;

/**
 * The selectedPieces array should already have been populated by music.selectPieces. This function mutates the selectedPieces array.
 * Apply a sorting algorithm on the appropriate field in the pieces, using the current sort direction to determine polarity.
 * Called from setSort when user wants to change sort criteria, but also from selectPieces in music.js upon first loading page
 */
function sortPieces() {
    selectedPieces.sort((thisPiece, otherPiece) => {
        if (thisPiece[currentSorter.key] < otherPiece[currentSorter.key]) {
            return currentSorter.direction * -1;
        } else if (thisPiece[currentSorter.key] > otherPiece[currentSorter.key]) {
            return currentSorter.direction;
        }
        return 0;
    });
}

/**
 * Toggle the direction on the given sorter, and set it to be the current sorter.
 * Called from durSort, titleSort, or dateSort in music.js when user changes sort criteria.
 * @param {object} sorter - The sorter to be set
 */
function setSort(sorter) {
    // Assume that any click that causes setSort to run is a directional toggle.
    sorter.toggleDirection();
    currentSorter = sorter;
    durSorter.setHeaderText();
    dateSorter.setHeaderText();
    titleSorter.setHeaderText();
	sortPieces();
}

/**
 * Refer to the form element of music.html.
 * @param {string} paramName - Typically either 'type' or 'keyword'
 * @returns {string} containing the parameter value if present, otherwise undefined
 */
 function getParam(paramName) {
    return new URLSearchParams(window.location.search).get(paramName);
}

/**
 * Create a new image and media link.
 * @param {string} filepath - Path to the requested media
 * @param {string} imagename - Filename of the image
 * @param {string} imagealt - Alternative text for non-image-displaying interfaces
 * @returns {object} An "a" anchor object containing an "img" image as a link
 */
function getMediaAnchor(filepath, imagename, imagealt) {
    const mediaImage = document.createElement("img");
    mediaImage.src = `images/${imagename}`;
    mediaImage.width = 24;
    mediaImage.height = 24;
    mediaImage.alt = imagealt;

    const mediaAnchor = document.createElement("a");
    mediaAnchor.href = filepath;
    mediaAnchor.appendChild(mediaImage);
    return mediaAnchor;
}

/**
 * Create a cell for links to media: recordings and/or scores
 * @param {object} piece - The piece that may contain media
 * @returns {object} a new Table Data cell containing links to score and recording, if they exist.
 */
function getMediaCell(piece) {
    const mediaCell = document.createElement("td");
    if (piece.score) {
        const anchor = getMediaAnchor(piece.score, 'score.gif', 'Score');
        mediaCell.appendChild(anchor);
    }
    if (piece.recording) {
        const anchor = getMediaAnchor(piece.recording, "mp3.gif", "Recording");
        mediaCell.appendChild(anchor);
    }
    mediaCell.className = "media";
    return mediaCell;
}

/**
 * Create a cell containing the formatted duration of the piece
 * @param {object} piece - The piece
 * @returns {object} a new Table Data cell containing a string in mm:ss format
 */
function getDurationCell(piece) {
    const durationCell = document.createElement("td");
    durationCell.innerHTML = piece.formattedTime;
    durationCell.className = "duration";
    return durationCell;
}

/**
 * Create a cell containing the formatted title and description of the piece
 * @param {object} piece - The piece
 * @returns {object} a new Table Data cell containing a Definition List with title and description of the piece
 */
function getDescriptionCell(piece) {
    const descriptionCell = document.createElement("td");
    descriptionCell.className = "description";
    const descList = document.createElement("dl");
    const descTerm = document.createElement("dt");
    descTerm.innerHTML = piece.title;
    const descDef = document.createElement("dd");
    descDef.innerHTML = piece.description;
    descList.appendChild(descTerm);
    descList.appendChild(descDef);
    descriptionCell.appendChild(descList);
    return descriptionCell;
}

/**
 * Create a cell containing the year of the piece
 * @param {object} piece - The piece
 * @returns {object} a new Table Data cell containing the year the piece was composed
 */
function getDateCell(piece) {
    const dateCell = document.createElement("td");
    dateCell.className = "date";
    dateCell.innerHTML = piece.year;
    return dateCell;
}

/**
 * Delete all but the header row, then add a fresh row for each piece in the selectedPieces table
 * @param {string} pageTitle - Optional title to be displayed at the top of the page. Set on initial page load
 */
function loadTable(pageTitle) {
    const theTable = document.getElementById("mainTable");
    while (theTable.rows.length > 1) {
      theTable.deleteRow(1);
      // Delete the second row of table until only the header is left
    }
    if (pageTitle) {
        theTable.caption.innerHTML = pageTitle;
    }

    selectedPieces.forEach((piece) => {
        const newRow = document.createElement("tr");
        newRow.appendChild(getMediaCell(piece));
        newRow.appendChild(getDurationCell(piece));
        newRow.appendChild(getDescriptionCell(piece));
        newRow.appendChild(getDateCell(piece));
        theTable.tBodies[0].appendChild(newRow);
   });
} 

/**
 * This is the function called at the bottom of music.html upon first loading the page. It determines what, if any,
 * query parameters might exist from a previous page load or from an external bookmark, sets the current document to
 * match those parameters, and filters the pieces array to match the params. It then sorts the pieces based on the
 * current sorting criteria, and loads the table with the selectedPieces.
 */
function selectPieces() {
    // Ensure that values defined in the URL are reflected in the current search and type dropdown
    const keywordElement = document.getElementById('keyword');
    const typeElement = document.getElementById('type');
    const keyword = getParam('keyword');
    const type = getParam('type');
    if (keyword) {
        keywordElement.value = keyword;
        typeElement.value = 'all';
    } else if (type) {
        typeElement.value = type;
    }
    // If no type was found in the URL the default type should be the first one on the list - 'piano'
    const pieceType = pieceTypes.find((pieceType) => pieceType.id === typeElement.value);
    let pageTitle;
    if (pieceType) {
        pageTitle = pieceType.title;
        selectedPieces = pieces.filter((piece) => {
            if (pieceType === PIANO || pieceType === INSTR) {
                // Use the filter exclusively - return pieces that specify only this type
                return piece.types.every((type) => type === pieceType);
            } else {
                // Use the filter inclusively - return pieces that include this type
                return piece.types.includes(pieceType);
            }
        });
    } else if (keywordElement.value) {
        const keywordRegex = new RegExp(keywordElement.value, 'i');
        pageTitle = `Pieces matching "${keywordElement.value}"`;
        selectedPieces = pieces.filter((piece) => piece.title.match(keywordRegex) || piece.description.match(keywordRegex));
    } else {
        pageTitle = 'All pieces';
        selectedPieces = pieces;
    }

    // Since selectedPieces is global, sortPieces can find and mutate the array.
    sortPieces();
    loadTable(pageTitle);
}

// Executed when the user clicks the Duration header in music.html
function durSort() {
	titleSorter.clearDirection();
	dateSorter.clearDirection();
	setSort(durSorter);
    // Note that we do not want or need to pass a new pageTitle - it will already have been set upon initial loading
    loadTable();
}

// Executed when the user clicks the Title header in music.html
function titleSort() {
	dateSorter.clearDirection();
	durSorter.clearDirection();
	setSort(titleSorter);
    loadTable();
}

// Executed when the user clicks the Date header in music.html
function dateSort() {
	titleSorter.clearDirection();
	durSorter.clearDirection();
	setSort(dateSorter);
    loadTable();
}