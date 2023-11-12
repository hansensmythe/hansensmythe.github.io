// Global site tag (gtag.js) - Google Analytics
let gaId = 'G-RQ9ZHH8RCE';
let script = document.createElement('script');
script.onload = function() {
    // This occurs asynchronously once the gtag script is loaded
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', gaId);
};
script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
document.head.appendChild(script);

// Called from almost every page to create header bar
function topInit() {
    init('');
}

// Called from pages one level deeper than top level
function innerInit() {
    init('../');
}

function init(prefix) {
    const headerDiv = document.getElementById('header');
    // Add standard stuff prior to menu
    const hdrLeft = document.createElement('div');
    hdrLeft.setAttribute('id', 'hdr_left');
    headerDiv.appendChild(hdrLeft);
    const hdrMug = document.createElement('div');
    hdrMug.setAttribute('id', 'hdr_mug');
    headerDiv.appendChild(hdrMug);

    // Add the shared title and dropdown menu elements
    const hdrRight = document.createElement('div');
    hdrRight.setAttribute('id', 'hdr_right');
    headerDiv.appendChild(hdrRight);
    const hdrTitle = document.createElement('div');
    hdrTitle.setAttribute('id', 'hdr_title');
    hdrTitle.appendChild(document.createTextNode(document.title));
    hdrRight.appendChild(hdrTitle);

    const navUL = document.createElement('ul');
    navUL.setAttribute('id', 'nav');
    hdrRight.appendChild(navUL);
    headerDiv.appendChild(hdrRight);

    // Home
    navUL.appendChild(getMenuItem(prefix, 'index.html', 'Home'));

    // Games
    const gamesLI = getMenuItem(prefix, '#', 'Games');
    navUL.appendChild(gamesLI);
    const gamesUL = document.createElement('ul');
    gamesLI.appendChild(gamesUL);
    gamesUL.appendChild(getMenuItem(prefix, 'crazyFactor.html', 'Crazy Factor'));
    gamesUL.appendChild(getMenuItem(prefix, 'qwirkle/setup.html', 'Qwirkle'));
    gamesUL.appendChild(getMenuItem(prefix, 'sheriff/scorer.html', 'Sheriff of Nottingham'));

    // Music
    navUL.appendChild(getMenuItem(prefix, 'music.html', 'Music'));

    // Op-ed
    const opedLI = getMenuItem(prefix, '#', 'Op-Ed');
    navUL.appendChild(opedLI);
    const opedUL = document.createElement('ul');
    opedLI.appendChild(opedUL);
    opedUL.appendChild(getMenuItem(prefix, 'oped/TrafficVsWar.html', 'Remembrance Day for Traffic Dead'));
    opedUL.appendChild(getMenuItem(prefix, 'oped/placenotation.html', 'Intro to Dot Place Notation'));
    opedUL.appendChild(getMenuItem(prefix, 'oped/VotingForChange.html', 'Voting for Change'));
    opedUL.appendChild(getMenuItem(prefix, 'oped/DearFinancial.html', 'Dear Financial Advisor:'));
    opedUL.appendChild(getMenuItem(prefix, 'oped/NOMA.html', 'Do the Magisteria of Science and Religion Overlap?'));
    opedUL.appendChild(getMenuItem(prefix, 'oped/framework.html', 'In Search of a Deeper Framework'));
    opedUL.appendChild(getMenuItem(prefix, 'oped/MAD.html', 'MADD, or just MAD?'));
}

function getMenuItem(prefix, target, text) {
    // If the href ends with #, treat it the same as a home page hit
    const href = window.location.href;
    if (href.charAt(href.length - 1) === '#') {
        href = 'index.html';
    }

    // Create and append a new list item to the list
    // Although it'd be simple to create a raw text node and apply it directly to the list item,
    // such text nodes cannot be padded etc. Better to create a paragraph, which can be.
    const li = document.createElement('li');
    if (href.indexOf(target, href.length - target.length) !== -1)
    {
        const p = document.createElement('p');
        p.innerHTML = text;
        li.appendChild(p);
    }
    else
    {
        const a = document.createElement('a');
        a.href = prefix + target;
        a.innerHTML = text;
        li.appendChild(a);
    }
    return li;
}
