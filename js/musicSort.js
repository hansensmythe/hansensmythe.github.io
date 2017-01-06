// This script interacts with the form
// and populates a subset of the master list
var currentSort = "";
var durSorter = new Sorter("dur", "Duration", false);
var titleSorter = new Sorter("title", "Title", false);
var dateSorter = new Sorter("date", "Year", false);

// Object containing sort-related values and defaults
function Sorter(sortID, sortText, defaultSort) {
	this.id = sortID;
	this.text = sortText;
	// this just sets the initial sort direction
	this.defaultSort = defaultSort;
	this.isAsc = defaultSort;
	this.sortAsc = sortText + " ascending";
	this.sortDesc = sortText + " descending";
}

// executed when the user clicks the Duration header
function durSort() {
	clearSort(titleSorter);
	clearSort(dateSorter);
	setSort(durSorter);
}

// executed when the user clicks the Title header
function titleSort() {
	clearSort(dateSorter);
	clearSort(durSorter);
	setSort(titleSorter);
}

// executed when the user clicks the Date header
function dateSort() {
	clearSort(titleSorter);
	clearSort(durSorter);
	setSort(dateSorter);
}

// called from the XSort methods
function clearSort(sorter) {
	sorter.isAsc = sorter.defaultSort;
}

function setSort(sorter) {
	sorter.isAsc = !sorter.isAsc;
	if (sorter.isAsc) {
		currentSort = sorter.sortAsc;
	} else {
		currentSort = sorter.sortDesc;
	}
	// refers to function in musicSearch.js
	sortArray();
}

// Use the currentSort value to resort pieces
function sortArray() {
	switch(currentSort) {
		case durSorter.sortDesc:
			selectedPieces.sort(durDesc);
			setHeaderText(durSorter, true);
			setHeaderText(dateSorter, false);
			setHeaderText(titleSorter, false);
			break;
		case durSorter.sortAsc:
			selectedPieces.sort(durAsc);
			setHeaderText(durSorter, true);
			setHeaderText(dateSorter, false);
			setHeaderText(titleSorter, false);
			break;
		case titleSorter.sortDesc:
			selectedPieces.sort(titleDesc);
			setHeaderText(durSorter, false);
			setHeaderText(dateSorter, false);
			setHeaderText(titleSorter, true);
			break;
		case titleSorter.sortAsc:
			selectedPieces.sort(titleAsc);
			setHeaderText(durSorter, false);
			setHeaderText(dateSorter, false);
			setHeaderText(titleSorter, true);
			break;
		case dateSorter.sortAsc:
			selectedPieces.sort(dateAsc);
			setHeaderText(durSorter, false);
			setHeaderText(dateSorter, true);
			setHeaderText(titleSorter, false);
			break;
		default:
			selectedPieces.sort(dateDesc);
			setHeaderText(durSorter, false);
			setHeaderText(dateSorter, true);
			setHeaderText(titleSorter, false);
	}
	if (isDebug) {
		console.log("sortArray sorted " + selectedPieces.length + " pieces by " + currentSort);
	}
	loadTable();
}

function dateAsc(timePiece, otherPiece) {
	return timePiece.year - otherPiece.year;
}

function dateDesc(timePiece, otherPiece) {
	return otherPiece.year - timePiece.year;
}

function durAsc(timePiece, otherPiece) {
	return timePiece.duration - otherPiece.duration;
}

function durDesc(timePiece, otherPiece) {
	return otherPiece.duration - timePiece.duration;
}

function titleAsc(titlePiece, otherPiece) {
	if (titlePiece.title < otherPiece.title) {
		return -1;
	}
	if (titlePiece.title > otherPiece.title) {
		return 1;
	}
	return 0;
}

function titleDesc(descPiece, otherPiece) {
	if (descPiece.title > otherPiece.title) {
		return -1;
	}
	if (descPiece.title < otherPiece.title) {
		return 1;
	}
	return 0;
}

// called from sortArray to rewrite link text
function setHeaderText(sorter, isCurrent) {
	var node = document.getElementById(sorter.id);
	if (isCurrent) {
		if (sorter.isAsc) {
			node.innerHTML = sorter.text + " &darr;";
		} else {
			node.innerHTML = sorter.text + " &uarr;";
		}
	} else {
		node.innerHTML = sorter.text;
	}
}
