(function () {
    const elem = document.querySelector("#parallax");

    const depthFactors = [0.0, 0.02, 0.06, 0.1];

    function calculateDepth(x, y) {
        let _w = window.innerWidth / 2;
        let _h = window.innerHeight / 2;
        let depths = depthFactors.map(factor => `${50 - (x - _w) * 0.0}% ${50 - (y - _h) * factor}%`);
        // Reverse the depths array to maintain the original order
        return depths.reverse().join(", ");
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    let x = window.innerWidth / 2; // default x to the center of the screen
    let y = 0; // start y at 0
    let startTime = performance.now(); // start time

    function animate(time) {
        let timeFraction = (time - startTime) / 1000; // calculate the fraction of time that has passed
        if (timeFraction > 1) timeFraction = 1;

        let newY = 270 * easeInOutCubic(timeFraction); // apply the easing function to the time fraction
        let backgroundPosition = calculateDepth(x, newY);

        console.log(x, newY, backgroundPosition);
        elem.style.backgroundPosition = backgroundPosition;

        if (timeFraction < 1) { // stop the animation after 1 second
            requestAnimationFrame(animate);
        }
    }

    // Start the animation
    requestAnimationFrame(animate);

})();
