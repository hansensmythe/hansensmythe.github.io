import { init } from './menu.js';

document.addEventListener('DOMContentLoaded', () => {
    init(0);
});

// Note that window.addEventListener('DOMContentLoaded') would fire
// only after document.addEventListener('DOMContentLoaded' was complete
// The 'load' event is specific to window, and would only fire after all resources are loaded.
