const inlineScrollers = document.querySelectorAll('.inline-scroll-scroller');

if(inlineScrollers.length > 0) {

    inlineScrollers.forEach((i) => {

        const inlineStartDetector = i.querySelector('.inline-scroll-startDetector');
        const inlineEndDetector = i.querySelector('.inline-scroll-endDetector');

        if (inlineStartDetector || inlineEndDetector) {
            const extremitiesCallback = (entries) => {
                entries.forEach((entry) => {
                    const { intersectionRatio, target } = entry; // Destructuring: affectation par décomposition.
                    if (target === inlineStartDetector) {
                        i.classList.toggle('fullyScrolledStart', intersectionRatio > 0);
                    } else if (target === inlineEndDetector) {
                        i.classList.toggle('fullyScrolledEnd', intersectionRatio > 0);
                    }
                });
            };

            const extremitiesOptions = {
                root: i
            }

            const extremitiesObserver = new IntersectionObserver(extremitiesCallback, extremitiesOptions);

            extremitiesObserver.observe(inlineStartDetector);
            extremitiesObserver.observe(inlineEndDetector);
        }
    })
}
