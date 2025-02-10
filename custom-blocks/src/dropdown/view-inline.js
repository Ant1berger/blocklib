const dropdownControllers = document.querySelectorAll(`.dropdown-parent:has(.dropdown:not(.-openOnHover)) .dropdown-controller`);

if(dropdownControllers.length) {

    // To open dropdowns when we click on the dropdown controller.
    const toggleDropdown = ({ target }) => {
        target.closest('.dropdown-parent').classList.toggle('dropdownOpen');
    }
    dropdownControllers.forEach(controller => controller.addEventListener('click', toggleDropdown));

    // To close open dropdowns when we click outside.
    const closeDropdowns = ({ target }) => {
        const openDropdowns = document.querySelectorAll('.dropdownOpen:has(.-closeWhenClickOutside)');
        openDropdowns.forEach((i) => {
            if (!i.contains(target)) {
                i.classList.remove('dropdownOpen');
            }
        });
    };
    document.addEventListener('click', closeDropdowns);
}
