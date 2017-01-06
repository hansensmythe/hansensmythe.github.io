// This script interacts with the musicList.html page
var selectedPieces = [];
var pageTitle = "";

// Get url parameters and select only relevant pieces, given the params
function filterPieces()
{
  var pieceIndex = getPieceIndex();
  var query = getQueryValue();
  var type = getType();

  if (-1 < pieceIndex)
  {
    // we got a specific piece in the parameters. Use it and ignore other params
    if (isDebug)
    {
      console.log("Started filterPieces using piece index=" + pieceIndex);
    }
    selectedPieces = new Array(pieceArray[pieceIndex]);
    pageTitle = pieceArray[pieceIndex].title;
  }
  else if (type != undefined)
  {
    // we got a type in the parameters. Use it and ignore the query
    try
    {
      // reset selectedPieces
      selectedPieces = [];
      var index;
      for ( index = 0; index < pieceArray.length; index++)
      {
        // special case - treat piano solos as unique, and don't include
        // pieces that merely include piano along with something else
        // Use type keys from music.js
        if (PIA == type.filter || INS == type.filter)
        {
          // require exact match
          if (type.filter == pieceArray[index].instrumentation)
          {
            selectedPieces[selectedPieces.length] = pieceArray[index];
          }
        }
        else if (0 < (pieceArray[index].instrumentation & type.filter))
        {
          selectedPieces[selectedPieces.length] = pieceArray[index];
        }
      }
      pageTitle = type.title;
    } catch (err)
    {
      console.log("filterPieces by type failed: " + err);
      window.location = "error.html";
    }
  }
  else if (query != "")
  {
    // we got a query in the parameters
    try
    {
      // reset selectedPieces
      selectedPieces = [];
      var index;
      for ( index = 0; index < pieceArray.length; index++)
      {
        if (-1 < pieceArray[index].title.toLowerCase().indexOf(query.toLowerCase()) || -1 < pieceArray[index].description.toLowerCase().indexOf(query.toLowerCase()))
        {
          selectedPieces[selectedPieces.length] = pieceArray[index];
        }
      }
      pageTitle = "Pieces matching search for " + query;
    } catch (err)
    {
      console.log("filterPieces by query failed: " + err);
      window.location = "error.html";
    }
  }
  else
  {
    if (isDebug)
    {
      console.log("All pieces selected");
    }
    selectedPieces = pieceArray;
    pageTitle = "All music";
  }
  if (isDebug)
  {
    console.log("Filter has " + selectedPieces.length + " selections.");
  }
  // sortArray reorders the selected pieces
  sortArray();
}

// Replace current table contents with new rows
function loadTable()
{
  try
  {
    if (isDebug)
    {
      console.log("loadTable with " + selectedPieces.length + " pieces last updated on " + updateDate);
    }
    var theTable = document.getElementById("mainTable");

    while (theTable.rows.length > 1)
    {
      theTable.deleteRow(1);
      //delete second row of table until only the header is left
    }

    theTable.caption.innerHTML = pageTitle;

    for (var index = 0; index < selectedPieces.length; index++)
    {
      var loadPiece = selectedPieces[index];
      // If we've explicitly defined a piece off the end of the array, this will happen:
      if ( typeof loadPiece === 'undefined')
      {
        console.log("Programming error: loadTable found undefined piece at index=" + index);
      }
      else
      {
        var newRow = document.createElement("tr");

        var mediaCell = document.createElement("td");
        addScoreAnchor(mediaCell, loadPiece);
        addMP3Anchor(mediaCell, loadPiece);
        mediaCell.className = "media";
        // see music.css
        newRow.appendChild(mediaCell);

        var durationCell = document.createElement("td");
        durationCell.innerHTML = getFormattedTime(loadPiece);
        durationCell.className = "duration";
        // see compositions.css
        newRow.appendChild(durationCell);

        var descriptionCell = document.createElement("td");
        descriptionCell.className = "description";
        // see compositions.css
        var defList = document.createElement("dl");
        var defTerm = document.createElement("dt");
        defTerm.innerHTML = loadPiece.title;
        var defDef = document.createElement("dd");
        defDef.innerHTML = loadPiece.description;
        defList.appendChild(defTerm);
        defList.appendChild(defDef);
        descriptionCell.appendChild(defList);
        newRow.appendChild(descriptionCell);

        var dateCell = document.createElement("td");
        dateCell.className = "date";
        // see compositions.css
        dateCell.innerHTML = loadPiece.year;
        newRow.appendChild(dateCell);

        theTable.tBodies[0].appendChild(newRow);
      }
    }
  } catch (err)
  {
    var answer = confirm("Failed to load the music table: " + err.message + ". TODO: how to respond?");
    if (answer)
    {
      filterPieces();
    }
    else
    {
      window.location = "error.html";
    }
  }
}

