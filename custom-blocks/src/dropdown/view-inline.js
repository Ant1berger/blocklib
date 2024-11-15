const DROPDOWN_CONTROLLER_CLASS = 'dropdown-controller';
const DROPDOWN_OPEN_CLASS = 'dropdownOpen';

const dropdownControllers = document.querySelectorAll(`.${DROPDOWN_CONTROLLER_CLASS}`);

if(dropdownControllers.length > 0) {

    const tellDropdownIsOpen = (event) => {
        const dropdownController = event.target.closest(`.${DROPDOWN_CONTROLLER_CLASS}`);
        const parent = dropdownController.closest(`:not(.${DROPDOWN_CONTROLLER_CLASS})`);
        parent.classList.toggle(DROPDOWN_OPEN_CLASS);
    }
    dropdownControllers.forEach((i) => {
        i.addEventListener('click', tellDropdownIsOpen);
    })

    // To close open dropdowns when we click outside.
    const closeOpenDropdowns = (event) => {
        const target = event.target;
        if (target) {
            const openDropdowns = document.querySelectorAll(`.${DROPDOWN_OPEN_CLASS}`);
            openDropdowns.forEach((i) => {
                if (!i.contains(target)) {
                    i.classList.remove(DROPDOWN_OPEN_CLASS);
                }
            });
        }
    };
    document.addEventListener('click', closeOpenDropdowns);
}
