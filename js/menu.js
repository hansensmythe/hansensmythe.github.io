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
    // Everything else
    const essaysLI = createMenuItem(prefix, '#', 'Topics');
    navUL.appendChild(essaysLI);
    const essaysUL = document.createElement('ul');
    essaysLI.appendChild(essaysUL);
    essaysUL.appendChild(createMenuItem(prefix, './environment/index.html', 'Environment'));
    essaysUL.appendChild(createMenuItem(prefix, './games/index.html', 'Games'));
    essaysUL.appendChild(createMenuItem(prefix, './music/index.html', 'Music'));
    essaysUL.appendChild(createMenuItem(prefix, './philosophy/index.html', 'Philosophy'));
    essaysUL.appendChild(createMenuItem(prefix, './transport/index.html', 'Transport'));
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
