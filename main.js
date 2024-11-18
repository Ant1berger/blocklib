const mainHeader = document.querySelector('.main-header');

if (!mainHeader) {
    console.warn('Main header element not found.');
    return;
}

// We want to let the user scroll 40 pixels down before we change the header's appearance.
const SCROLL_THRESHOLD = 40;
const CLASS_NAMES = ['-shrunk', '-pageScrolled'];

const adaptHeaderAccordingToScrollY = function() {
    if(window.scrollY >= SCROLL_THRESHOLD) {
        mainHeader.classList.add(...CLASS_NAMES);
    } else {
        mainHeader.classList.remove(...CLASS_NAMES);
    }
}
document.addEventListener('scroll', adaptHeaderAccordingToScrollY);
document.addEventListener('DOMContentLoaded', adaptHeaderAccordingToScrollY);
