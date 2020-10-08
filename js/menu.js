// Global site tag (gtag.js) - Google Analytics
var gaId = 'UA-1619574-4';
var script = document.createElement('script');
script.onload = function() {
    // This occurs asynchronously once the gtag script is loaded
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', gaId);
};
script.src = 'https://www.googletagmanager.com/gtag/js?' + gaId;
document.head.appendChild(script);

var PIA = 1;
var VOC = 2;
var INS = 4;
var THE = 8;
var FLM = 16;
var ORC = 32;
var EXP = 64;
var ARR = 128;

// Create a Type object for every line
function Type(id, filter, title, menulabel)
{
  this.id = id;
  this.filter = filter;
  this.title = title;
  this.menulabel = menulabel;
}
var typeArray = new Array();
typeArray.push(new Type("piano", PIA, "Piano pieces", "Solo piano"));
typeArray.push(new Type("voice", VOC, "Vocal pieces", "Vocal"));
typeArray.push(new Type("theatre", THE, "Pieces for live theatre", "for Theatre"));
typeArray.push(new Type("film", FLM, "Pieces for film or broadcast media", "for Film/TV"));
typeArray.push(new Type("orch", ORC, "Orchestral works", "Orchestral"));
typeArray.push(new Type("instr", INS, "Other Instrumental pieces", "Instrumental"));
typeArray.push(new Type("exp", EXP, "Experimental pieces", "Experimental"));
typeArray.push(new Type("arr", ARR, "Covers of other pieces", "Arrangements"));

// called from almost every page to create header bar
function topInit()
{
  init("");
}

// called from pages one level deeper than top level
function innerInit()
{
  init("../");
}

function init(prefix)
{
  var headerDiv = document.getElementById("header");

  // add the shared title and dropdown menu elements
  var hdrRight = document.getElementById("hdr_right");
  var hdrTitle = document.createElement("div");
  hdrTitle.setAttribute("id", "hdr_title");
  hdrTitle.appendChild(document.createTextNode(document.title));
  hdrRight.appendChild(hdrTitle);

  // if pages include default menu for non-javascript browsers, remove it
  headerDiv.removeChild(document.getElementById("nav"));
  // and create a new one
  var navUL = document.createElement("ul");
  navUL.setAttribute("id", "nav");
  hdrRight.appendChild(navUL);
  headerDiv.appendChild(hdrRight);

  // Home
  navUL.appendChild(getMenuItem(prefix, "index.html", "Home"));

  // Music
  var compLI = getMenuItem(prefix, "#", "Music");
  navUL.appendChild(compLI);
  var compUL = document.createElement("ul");
  compLI.appendChild(compUL);
  var typeCount = typeArray.length;
  for (var i = 0; i < typeCount; i++)
  {
    compUL.appendChild(getMenuItem(prefix, "musicList.html?t=" + typeArray[i].id, typeArray[i].menulabel));
  }

  // Op-ed
  var opedLI = getMenuItem(prefix, "#", "Op-Ed");
  navUL.appendChild(opedLI);
  var opedUL = document.createElement("ul");
  opedLI.appendChild(opedUL);
  opedUL.appendChild(getMenuItem(prefix, "oped/placenotation.html", "Intro to Dot Place Notation"));
  opedUL.appendChild(getMenuItem(prefix, "oped/VotingForChange.html", "Voting for Change"));
  opedUL.appendChild(getMenuItem(prefix, "oped/DearFinancial.html", "Dear Financial Advisor:"));
  opedUL.appendChild(getMenuItem(prefix, "oped/NOMA.html", "Do the Magisteria of Science and Religion Overlap?"));
  opedUL.appendChild(getMenuItem(prefix, "oped/framework.html", "In Search of a Deeper Framework"));
  opedUL.appendChild(getMenuItem(prefix, "oped/MAD.html", "MADD, or just MAD?"));

  // Blog - this never gets a prefix because it's a 3rd party link
  // navUL.appendChild(getMenuItem("", "http://hansensmythe.shawwebspace.ca/blog/", "Blog"));
}

function getMenuItem(prefix, target, text)
{
  // if the href ends with #, treat it the same as a home page hit
  var href = window.location.href;
  if (href.indexOf('#', href.length - 1) !== -1)
  {
    href = 'index.html';
  }

  // create and append a new list item to the list
  // Although it'd be simple to create a raw text node and apply it directly to the list item,
  // such text nodes cannot be padded etc. Better to create a paragraph, which can be.
  var li = document.createElement("li");
  if (href.indexOf(target, href.length - target.length) !== -1)
  {
    var p = document.createElement("p");
    p.innerHTML = text;
    li.appendChild(p);
  }
  else
  {
    var a = document.createElement("a");
    a.href = prefix + target;
    a.innerHTML = text;
    li.appendChild(a);
  }
  return li;
}
