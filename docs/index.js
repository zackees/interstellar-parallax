(function () {
    const elems = [
        document.querySelector("#parallax-text"),
        document.querySelector("#parallax-hero"),
        document.querySelector("#parallax-triangle"),
        document.querySelector("#parallax-background")
    ];

    let depthFactors = [0.0, 0.0, -0.6, 1.0];
    const bias = 15.0;
    depthFactors = depthFactors.map(factor => factor * bias);

    function calculateDepth(x, y) {
        let _w = window.innerWidth / 2;
        let _h = window.innerHeight / 2;
        let depths = depthFactors.map(factor => `${50 - (x - _w) * 0.0}% ${50 - (y - _h) * factor}%`);
        // Reverse the depths array to maintain the original order
        return depths.reverse();
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    let x = window.innerWidth / 2; // default x to the center of the screen
    let y = 0; // start y at 0
    let startTime = performance.now(); // start time

    // Maximum movement should be a percentage of window's height
    const maxMovement = window.innerHeight * 0.5;

    function animate(time) {
        let timeFraction = (time - startTime) / 1000; // calculate the fraction of time that has passed
        if (timeFraction > 1) timeFraction = 1;

        let newY = maxMovement * easeInOutCubic(timeFraction); // apply the easing function to the time fraction
        let backgroundPositions = calculateDepth(x, newY);

        for (let i = 0; i < elems.length; i++) {
            let elem = elems[i];
            let backgroundPosition = backgroundPositions[i];
            console.log(x, newY, backgroundPosition);
            elem.style.backgroundPosition = backgroundPosition;
        }

        if (timeFraction < 1) { // stop the animation after 1 second
            requestAnimationFrame(animate);
        }
    }

    // Start the animation
    requestAnimationFrame(animate);

})();
