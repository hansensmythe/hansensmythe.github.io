// Global site tag (gtag.js) - Google Analytics
const gaId = 'G-RQ9ZHH8RCE';
const script = document.createElement('script');
script.onload = function () {
    // This occurs asynchronously once the gtag script is loaded
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', gaId);
};
script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
document.head.appendChild(script);

// Used to support hamburger menu stylesheet
function addStylesheet(href) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    // Append to the first head element found
    document.getElementsByTagName('head')[0].appendChild(link);
}

function createItalicClassElement(className, text) {
    const italicElement = document.createElement('i');
    italicElement.className = className;
    italicElement.textContent = text;
    return italicElement;
}

function initMenu() {
    const menu = document.querySelector('.menu');
    const closeIcon = document.querySelector('.closeIcon');
    const menuIcon = document.querySelector('.menuIcon');
    menu.classList.remove('showMenu');
    closeIcon.style.display = 'none';
    menuIcon.style.display = 'block';
}

function toggleMenu() {
    const menu = document.querySelector('.menu');
    const closeIcon = document.querySelector('.closeIcon');
    const menuIcon = document.querySelector('.menuIcon');

    if (menu.classList.contains('showMenu')) {
        menu.classList.remove('showMenu');
        closeIcon.style.display = 'none';
        menuIcon.style.display = 'block';
    } else {
        menu.classList.add('showMenu');
        closeIcon.style.display = 'block';
        menuIcon.style.display = 'none';
    }
}

export function init(prefix) {
    // Get hamburger and close icons from Google APIs
    addStylesheet('https://fonts.googleapis.com/icon?family=Material+Icons');
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

    // Hamburger menu
    const menuUL = document.createElement('ul');
    menuUL.className = 'menu';
    menuUL.appendChild(createListItemWithChildren(prefix, 'Environment', [
        { href: 'environment/VotingForChange.html', text: 'Voting for Change' },
        { href: 'environment/DearFinancial.html', text: 'Dear Financial Advisor' }
    ]));
    menuUL.appendChild(createListItemWithChildren(prefix, 'Games', [
        { href: 'games/crazyFactor.html', text: 'Crazy Factor card game' },
        { href: 'games/sheriff/scorer.html', text: 'Sheriff of Nottingham scorer' },
        { href: 'games/qwirkle/setup.html', text: 'Qwirkle Connect setup tool' }
    ]));
    menuUL.appendChild(createListItemWithChildren(prefix, 'Music', [
        { href: 'music/music.html', text: 'Scores and Recordings' },
        { href: 'music/PlaceNotation.html', text: 'Introduction to Dot Place Notation' }
    ]));
    menuUL.appendChild(createListItemWithChildren(prefix, 'Philosophy', [
        { href: 'philosophy/LandAcknowledgement.html', text: 'Land Acknowledgement' },
        { href: 'philosophy/NOMA.html', text: 'Do the magisteria of science and religion overlap?' },
        { href: 'philosophy/DeeperFramework.html', text: 'In search of a deeper framework' }
    ]));
    menuUL.appendChild(createListItemWithChildren(prefix, 'Transport', [
        { href: 'transport/FlightPerspectiveGenerator.html', text: 'Flight Perspective Generator' },
        { href: 'transport/CelebrityFlightPerspectiveGenerator.html', text: 'Celebrity Flight Perspective Generator' },
        { href: 'transport/TrafficVsWar.html', text: 'Traffic vs War: which is more deadly?' },
        { href: 'transport/Velomobile.html', text: 'My Velomobile' },
        { href: 'transport/MAD.html', text: 'MADD, or just MAD?' }
    ]));
    menuUL.appendChild(createMenuItem(prefix, 'resume.html', 'Resume'));
    navUL.appendChild(menuUL);

    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.appendChild(createItalicClassElement('menuIcon material-icons', 'menu'));
    hamburger.appendChild(createItalicClassElement('closeIcon material-icons', 'close'));
    navUL.appendChild(hamburger);
    hamburger.addEventListener('click', toggleMenu);
    // Initialize the menu to force it to show only the hamburger and not the X
    initMenu();
}

/**
 * 
 * @param {string} prefix - Navigation prefix for links to find their way e.g. '../'
 * @param {string} categoryName - Display text for category 
 * @param {object[]} menuItems - Array of menu items containing href and display text
 * @returns 
 */
function createListItemWithChildren(prefix, categoryName, menuItems) {
    const newLI = createMenuItem(prefix, '#', categoryName);
    const newUL = document.createElement('ul');
    newLI.appendChild(newUL);
    menuItems.forEach((menuItem) => {
        newUL.appendChild(createMenuItem(prefix, menuItem.href, menuItem.text));
    });
    return newLI;
}

export function createMenuItem(prefix, target, text) {
    // If the href ends with #, treat it the same as a home page hit
    let href = window.location.href;
    if (href.charAt(href.length - 1) === '#') {
        href = 'index.html';
    }

    // Create and append a new list item to the list
    // Although it'd be simple to create a raw text node and apply it directly to the list item,
    // such text nodes cannot be padded etc. Better to create a paragraph, which can be.
    const li = document.createElement('li');
    if (href.indexOf(target, href.length - target.length) !== -1) {
        const p = document.createElement('p');
        p.innerHTML = text;
        li.appendChild(p);
    } else {
        const a = document.createElement('a');
        a.href = prefix + target;
        a.innerHTML = text;
        a.className = 'menuItem';
        li.appendChild(a);
    }
    li.addEventListener('click', toggleMenu);

    return li;
}
