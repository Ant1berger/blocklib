const mainHeader = document.querySelector('.main-header');

if (mainHeader) {

    // We want to let the user scroll 40 pixels down before we change the header's appearance.
    const SCROLL_THRESHOLD = 0;
    const CLASS_NAMES = ['-shrunk', '-pageScrolled'];

    const adaptHeaderAccordingToScrollY = function() {
        if(window.scrollY >= SCROLL_THRESHOLD) {
            mainHeader.classList.add(...CLASS_NAMES);
        } else {
            mainHeader.classList.remove(...CLASS_NAMES);
        }
    };
    document.addEventListener('scroll', adaptHeaderAccordingToScrollY);
    document.addEventListener('DOMContentLoaded', adaptHeaderAccordingToScrollY);

    // Mobile nav open/close
    const mainNavControllers = document.querySelectorAll('.main-nav-overlay, .main-nav-trigger');

    const toggleMenuOnClick = (item) => {
        item.addEventListener('click', () => {
            mainHeader.classList.toggle('menuOpen');
        });
    };

    if(mainNavControllers.length > 0) {
        mainNavControllers.forEach((i) => {
            toggleMenuOnClick(i);
        })
    };
};
