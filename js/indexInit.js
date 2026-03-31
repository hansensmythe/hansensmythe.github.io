import { init } from './menu.js';

window.addEventListener('load', () => {
        init('');
        // add the Resume and links to the home page menu. Not worth doing for every page
        const navUL = document.getElementById("nav");
        navUL.appendChild(getMenuItem("", "resume.html", "Creative Resume"));
});
