import { PIECES, GENRES, INSTRUMENTS, FAVOURITES } from './pieces.js';
const PAUSEBUTTON_CLASS = 'pauseButton';
const PLAYBUTTON_CLASS = 'playButton';
const PLAYERBUTTON_CLASS = 'playerButton';
const ALBUM_DIMENSION = 48;
const MEDIA_DIMENSION = 36;
const GENRE_PARAM = 'genre';
const INSTR_PARAM = 'instr';
const SEARCH_PARAM = 'search';
const GENRE_SELECT = 'genreSelect';
const INSTR_SELECT = 'instrSelect';
const SEARCH_INPUT = 'searchInput';

// Initialize once DOM in index.html is ready, then show default or param-filtered pieces
document.addEventListener('DOMContentLoaded', initialize);
// Change events for genre changes
document.getElementById(GENRE_SELECT).addEventListener('change', handleGenreEvent);
document.getElementById(INSTR_SELECT).addEventListener('change', handleInstrEvent);
document.getElementById(SEARCH_INPUT).addEventListener('input', handleSearchInputEvent);

// Clicks for page control such as sorting or player control
document.getElementById('contents').addEventListener('click', handleClickEvent);

// selectedPieces needs to be global so it can be set by selectPieces
// but then used separately to sort the selected pieces
let selectedPieces = [];
let loadedPieceIndex = -1;

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

const durSorter = new Sorter('duration', 'Duration', 0);
const titleSorter = new Sorter('title', 'Title', 0);
const dateSorter = new Sorter('year', 'Year', -1);
// Use dateSorter as a default
let currentSorter = dateSorter;

/**
 * Update URL to include a query parameter
 * 
 * @param {string} key - query parameter key, i.e. GENRE_PARAM, INSTR_PARAM, or SEARCH_PARAM
 * @param {string} value - value string matching parameter, e.g. 'trombone'
 */
function setQueryParam(key, value) {
    // Parse the current URL
    const url = new URL(window.location);

    // Set or update the query parameter
    url.searchParams.set(key, value);

    // Update the browser URL without reloading
    window.history.replaceState({}, '', url.toString());
    // Use pushState if you want to preserve history, or replaceState if you want to replace the current entry
}

/**
 * Extract the value of a specific query parameter from the URL
 * 
 * @param {string} key - query parameter key, i.e. GENRE_PARAM, INSTR_PARAM, or SEARCH_PARAM
 * @returns {string} containing the parameter value if present, otherwise undefined
 */
function getQueryParam(key) {
    return new URLSearchParams(window.location.search).get(key);
}

/**
 * Remove a single query parameter from the URL
 * 
 * @param {string} key - The string used to identify the parameter in the URL query, e.g. 'search'
 */
function removeQueryParam(key) {
    const url = new URL(window.location.href);
    url.searchParams.delete(key);
    window.history.replaceState({}, '', url.toString());
}

function clearGenre() {
    removeQueryParam(GENRE_PARAM);
    document.getElementById(GENRE_SELECT).value = '';
}

function clearInstr() {
    removeQueryParam(INSTR_PARAM);
    document.getElementById(INSTR_SELECT).selectedIndex = -1;
}

function clearSearch() {
    removeQueryParam(SEARCH_PARAM);
    document.getElementById(SEARCH_INPUT).value = '';
}

/**
 * Dynamically populate an empty dropdown list identified by id
 * 
 * @param {string} elementId - id of dropdown
 * @param {Filter} filterArray - objects containing option values and text
 */
function populateDropdown(elementId, filterArray) {
    const element = document.getElementById(elementId);
    filterArray.forEach((filter) => {
        const option = document.createElement('option');
        option.value = filter.id;
        option.text = filter.title;
        element.append(option);
    });
}

function initialize() {
    // Populate dynamic filters
    populateDropdown(GENRE_SELECT, GENRES);
    populateDropdown(INSTR_SELECT, INSTRUMENTS);

    // Apply query parameters to the filter elements if required
    const searchParam = getQueryParam(SEARCH_PARAM);
    if (searchParam) {
        // Put query parameter into search input box
        document.getElementById(SEARCH_INPUT).value = searchParam;
    } else {
        // Only apply genre and instrument filters if no searchParam is found
        const genreParam = getQueryParam(GENRE_PARAM);
        // Guard against bogus genre values
        const targetGenre = GENRES.find((genre) => genre.id === genreParam);
        if (targetGenre) {
            document.getElementById(GENRE_SELECT).value = targetGenre.id;
        }

        const instrParam = getQueryParam(INSTR_PARAM);
        if (instrParam) {
            // Turn the comma-separated values in query into an array
            const instrQueryArray = instrParam.split(',');
            // Guard against bogus instrument values by including only values matching our INSTRUMENTS array
            const targetInstrumentIds = INSTRUMENTS
                .filter((instrument) => instrQueryArray.includes(instrument.id))
                .map(instrument => instrument.id);
            const instrSelect = document.getElementById(INSTR_SELECT);
            Array.from(instrSelect.options).forEach((option) => {
                option.selected = targetInstrumentIds.includes(option.value);
            });
        }
    }

    selectPieces();
}

/**
 * The selectedPieces array should already have been populated by selectPieces. This function mutates the selectedPieces array.
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
 * Update the search URL parameter, clear the other parameters, and refilter the pieces
 * 
 * @param {object} event - containing target.id and target.value
 */
function handleSearchInputEvent(event) {
    setQueryParam(SEARCH_PARAM, event.target.value);
    clearGenre();
    clearInstr();
    selectPieces();
}

function handleGenreEvent(event) {
    // Clear the search and instr filters
    clearSearch();
    clearInstr();
    // Add the genre query param
    setQueryParam(GENRE_PARAM, event.target.value);
    selectPieces();
}

function handleInstrEvent() {
    // Clear keyword and genre so they don't override this filter, but update the instr query
    clearSearch();
    clearGenre();
    const instrSelect = document.getElementById(INSTR_SELECT);
    const selectedInstruments = Array.from(instrSelect.selectedOptions).map(option => option.value);
    setQueryParam(INSTR_PARAM, selectedInstruments);
    selectPieces();
}

function handleClickEvent(event) {
    if (event.target.id == 'duration') {
        // Executed when the user clicks the Duration header in music.html
        titleSorter.clearDirection();
        dateSorter.clearDirection();
        setSort(durSorter);
        // Note that we do not want or need to pass a new pageTitle - it will already have been set upon initial loading
        loadTable();
    } else if (event.target.id == 'title') {
        // Executed when the user clicks the Title header in music.html
        dateSorter.clearDirection();
        durSorter.clearDirection();
        setSort(titleSorter);
        loadTable();
    } else if (event.target.id == 'year') {
        // Executed when the user clicks the Date header in music.html
        titleSorter.clearDirection();
        durSorter.clearDirection();
        setSort(dateSorter);
        loadTable();
    } else if (event.target.classList.contains(PLAYERBUTTON_CLASS)) {
        const playerText = document.getElementById('playerText');
        const player = document.getElementById('player');
        const isPlaying = !player.paused;
        const clickedButton = document.getElementById(event.target.id);
        if (event.target.id == loadedPieceIndex) {
            // This one is already loaded, so pause if playing and play if paused,
            // and set the button to what its NEXT action will be.
            if (isPlaying) {
                player.pause();
                // Change button to "play" class
                clickedButton.classList.replace(PAUSEBUTTON_CLASS, PLAYBUTTON_CLASS);
            } else {
                player.play();
                // Change button to "pause" class
                clickedButton.classList.replace(PLAYBUTTON_CLASS, PAUSEBUTTON_CLASS);
            }
        } else {
            const selectedPiece = PIECES[parseInt(event.target.id)];
            const previousButton = document.getElementById(loadedPieceIndex);
            if (previousButton) {
                previousButton.classList.replace(PAUSEBUTTON_CLASS, PLAYBUTTON_CLASS);
            }

            const audioMP3 = document.getElementById('audioMP3');
            audioMP3.src = selectedPiece.localMP3;
            player.load();
            player.play();
            clickedButton.classList.replace(PLAYBUTTON_CLASS, PAUSEBUTTON_CLASS);
            playerText.textContent = `Playing '${selectedPiece.title}'`;
            loadedPieceIndex = event.target.id;
        }
    }
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
 * Create a new square image with fixed width for clickable media links or album covers
 * 
 * @param {string} imagename - Filename of the image
 * @param {string} imagealt - Alternative text for non-image-displaying interfaces
 * @param {number} dimension - number of pixels wide and high, assuming image is square
 * @returns img element
 */
function getImage(imagename, imagealt, dimension) {
    const mediaImage = document.createElement('img');
    mediaImage.setAttribute('src', imagename);
    mediaImage.setAttribute('width', dimension);
    mediaImage.setAttribute('height', dimension);
    mediaImage.setAttribute('title', imagealt);
    mediaImage.setAttribute('alt', imagealt);
    return mediaImage;
}

function getAlbumImgCell(piece) {
    const albumCell = document.createElement('td');
    if (piece.img) {
        const albumImage = getImage(`./albumImages/${piece.img}`, piece.title, ALBUM_DIMENSION);
        albumCell.appendChild(albumImage);
    }
    albumCell.className = 'album';
    return albumCell;
}

/**
 * Create a new image and media link.
 * @param {string} filepath - Path to the requested media
 * @param {string} imagename - Filename of the image
 * @param {string} imagealt - Alternative text for non-image-displaying interfaces
 * @returns {object} An "a" anchor object containing an "img" image as a link
 */
function getMediaAnchor(filepath, imagename, imagealt) {
    const mediaImage = getImage(imagename, imagealt, MEDIA_DIMENSION);

    const mediaAnchor = document.createElement('a');
    mediaAnchor.href = filepath;
    mediaAnchor.appendChild(mediaImage);
    return mediaAnchor;
}

/**
 * Create a cell for links to media: recordings and/or scores
 * @param {object} piece - The piece that may contain media
 * @returns {object} a new Table Data cell containing links to score and recordings, if they exist.
 */
function getMediaCell(piece) {
    const mediaCell = document.createElement('td');
    if (piece.score) {
        const anchor = getMediaAnchor(piece.score, './images/score.gif', 'Score');
        mediaCell.appendChild(anchor);
    }
    if (piece.youtube) {
        const anchor = getMediaAnchor(piece.youtube, './images/youtube.png', 'Youtube');
        mediaCell.appendChild(anchor);
    }
    if (piece.localMP3) {
        const playButton = document.createElement('button');
        playButton.id = `${piece.id}`; // Backticks turn number into a string, which is safe for id
        playButton.classList.add(PLAYERBUTTON_CLASS, PLAYBUTTON_CLASS);
        mediaCell.appendChild(playButton);
    }
    mediaCell.className = 'media';
    return mediaCell;
}

/**
 * Create a cell containing the formatted duration of the piece
 * @param {object} piece - The piece
 * @returns {object} a new Table Data cell containing a string in mm:ss format
 */
function getDurationCell(piece) {
    const durationCell = document.createElement('td');
    durationCell.innerHTML = piece.formattedTime;
    durationCell.className = 'duration';
    return durationCell;
}

/**
 * Create a cell containing the formatted title and description of the piece
 * @param {object} piece - The piece
 * @returns {object} a new Table Data cell containing a Definition List with title and description of the piece
 */
function getDescriptionCell(piece) {
    const descriptionCell = document.createElement('td');
    descriptionCell.className = 'description';
    const descList = document.createElement('dl');
    const descTerm = document.createElement('dt');
    descTerm.innerHTML = piece.title;
    const descDef = document.createElement('dd');
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
    const dateCell = document.createElement('td');
    dateCell.className = 'date';
    dateCell.innerHTML = piece.year;
    return dateCell;
}

/**
 * Delete all but the header row, then add a fresh row for each piece in the selectedPieces table
 * @param {string} pageTitle - Optional title to be displayed at the top of the page. Set on initial page load
 */
function loadTable(pageTitle) {
    const theTable = document.getElementById('mainTable');
    while (theTable.rows.length > 1) {
        theTable.deleteRow(1);
        // Delete the second row of table until only the header is left
    }
    if (pageTitle) {
        theTable.caption.innerHTML = pageTitle;
    }

    selectedPieces.forEach((piece) => {
        const newRow = document.createElement('tr');
        newRow.appendChild(getAlbumImgCell(piece));
        newRow.appendChild(getMediaCell(piece));
        newRow.appendChild(getDurationCell(piece));
        newRow.appendChild(getDescriptionCell(piece));
        newRow.appendChild(getDateCell(piece));
        theTable.tBodies[0].appendChild(newRow);
    });
}

/**
 * This is the function called upon first loading the page and subsequently when filter values change.
 * It filters pieces to match current filter parameters, then sorts the pieces based on the
 * current sorting criteria, and loads the table with the selectedPieces.
 */
function selectPieces() {
    const searchInput = document.getElementById(SEARCH_INPUT);
    const genreSelect = document.getElementById(GENRE_SELECT);
    const instrSelect = document.getElementById(INSTR_SELECT);
    const selectedInstruments = Array.from(instrSelect.selectedOptions).map(option => option.value);

    let pageTitle;
    let isSorted = false;
    if (searchInput.value) {
        const keywordRegex = new RegExp(searchInput.value, 'i');
        pageTitle = `Pieces matching "${searchInput.value}"`;
        selectedPieces = PIECES.filter((piece) => piece.title.match(keywordRegex) || piece.description.match(keywordRegex));
    } else if (genreSelect.value) {
        pageTitle = genreSelect.options[genreSelect.selectedIndex].text;
        if (genreSelect.value == FAVOURITES.id) {
            selectedPieces = PIECES.filter((piece) => piece.priority > 0);
            // Override initial sorting to apply priority sort. We should only do this upon initially
            // selecting the genre, however, so that users can later re-sort pieces by header criteria
            selectedPieces.sort((thisPiece, otherPiece) => {
                if (thisPiece.priority < otherPiece.priority) {
                    return -1;
                } else if (thisPiece.priority > otherPiece.priority) {
                    return 1;
                }
                return 0;
            });
            isSorted = true;
        } else {
            selectedPieces = PIECES.filter((piece) => piece.genre == genreSelect.value);
        }
    } else if (selectedInstruments.length) {
        pageTitle = `Pieces for ${selectedInstruments.join(" & ")}`;
        selectedPieces = PIECES.filter((piece) => {
            // Ensure that the two arrays are equivalent, e.g. each includes only piano, or piano and voice
            if (piece.instruments.length !== selectedInstruments.length) return false;
            return piece.instruments.every(instrumentInPiece => selectedInstruments.includes(instrumentInPiece.id));
        });
    } else {
        pageTitle = 'All pieces';
        selectedPieces = PIECES;
    }


    // Since selectedPieces is global, sortPieces can find and mutate the array.
    if (!isSorted) {
        sortPieces();
    }
    loadTable(pageTitle);
}
