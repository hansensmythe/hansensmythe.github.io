import { createMenuItem, init } from './menu.js';

window.addEventListener('load', () => {
        init('');
        // add the Resume link to the home page menu. Not worth doing for every page
        const navUL = document.getElementById("nav");
        navUL.appendChild(createMenuItem("", "resume.html", "Creative Resume"));
});
