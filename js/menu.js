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

export function init(prefix) {
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
    navUL.appendChild(createMenuItem(prefix, 'index.html', 'Home'));

    // Environment-related essays
    const environmentLI = createMenuItem(prefix, '#', 'Environment');
    navUL.appendChild(environmentLI);
    const environmentUL = document.createElement('ul');
    environmentLI.appendChild(environmentUL);
    environmentUL.appendChild(createMenuItem(prefix, 'environment/DearFinancial.html', 'Dear Financial Advisor:'));
    environmentUL.appendChild(createMenuItem(prefix, 'environment/VotingForChange.html', 'Voting for Change'));

    // Games
    const gamesLI = createMenuItem(prefix, '#', 'Games');
    navUL.appendChild(gamesLI);
    const gamesUL = document.createElement('ul');
    gamesLI.appendChild(gamesUL);
    gamesUL.appendChild(createMenuItem(prefix, 'games/crazyFactor.html', 'Crazy Factor'));
    gamesUL.appendChild(createMenuItem(prefix, 'games/qwirkle/setup.html', 'Qwirkle'));
    gamesUL.appendChild(createMenuItem(prefix, 'games/sheriff/scorer.html', 'Sheriff of Nottingham'));

    // Music
    const musicLI = createMenuItem(prefix, '#', 'Music');
    navUL.appendChild(musicLI);
    const musicUL = document.createElement('ul');
    musicLI.appendChild(musicUL);
    musicUL.appendChild(createMenuItem(prefix, 'music/music.html', 'Music'));
    musicUL.appendChild(createMenuItem(prefix, 'music/PlaceNotation.html', 'Intro to Dot Place Notation'));

    // Philosophy
    const philosophyLI = createMenuItem(prefix, '#', 'Philosophy');
    navUL.appendChild(philosophyLI);
    const philosophyUL = document.createElement('ul');
    philosophyLI.appendChild(philosophyUL);
    philosophyUL.appendChild(createMenuItem(prefix, 'philosophy/LandAcknowledgement.html', 'Land Acknowledgement'));
    philosophyUL.appendChild(createMenuItem(prefix, 'philosophy/NOMA.html', 'Do the Magisteria of Science and Religion Overlap?'));
    philosophyUL.appendChild(createMenuItem(prefix, 'philosophy/DeeperFramework.html', 'In Search of a Deeper Framework'));

    // Transport
    const transportLI = createMenuItem(prefix, '#', 'Transport');
    navUL.appendChild(transportLI);
    const transportUL = document.createElement('ul');
    transportLI.appendChild(transportUL);
    transportUL.appendChild(createMenuItem(prefix, 'transport/fpg/FlightPerspectiveGenerator.html', 'Flight Perspective Generator'));
    transportUL.appendChild(createMenuItem(prefix, 'transport/fpg/CelebrityFlightPerspectiveGenerator.html', 'Celebrity Flight Perspective Generator'));
    transportUL.appendChild(createMenuItem(prefix, 'transport/TrafficVsWar.html', 'Remembrance Day for Traffic Dead'));
    transportUL.appendChild(createMenuItem(prefix, 'transport/Velomobile.html', 'My Velomobile'));
    transportUL.appendChild(createMenuItem(prefix, 'transport/MAD.html', 'MADD, or just MAD?'));
}

function createMenuItem(prefix, target, text) {
    // If the href ends with #, treat it the same as a home page hit
    let href = window.location.href;
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
