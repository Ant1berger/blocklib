// This mutation observer will update the "blocklist" NodeList with all custom blocks instances in the page.
// This is needed to know if we have to attach a block's <styles> to its instance or not.
let blockList;
const toObserve = document.getElementById('editor');
const toObserveConfig = { childList: true, subtree: true };
const checkChanges = function(mutationsList) {
    mutationsList.forEach(function(mutation) {
        blockList = document.querySelectorAll('#editor [id^="blocklib"]');
    });
};
const selectorObserver = new MutationObserver(checkChanges);
selectorObserver.observe(toObserve, toObserveConfig);
