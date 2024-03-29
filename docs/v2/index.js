(function () {
    let params = new URLSearchParams(window.location.search);
    let durationParam = params.get('duration');
    
    const DURATION = durationParam ? durationParam * 1000 : 1500;

    const elemsWithImages = [
        {elem: document.querySelector("#parallax-text"), url: "../imgs/Text_Main_Banner.webp"},
        {elem: document.querySelector("#parallax-hero"), url: "../imgs/Hero_Layer_Banner.webp"},
        {elem: document.querySelector("#parallax-triangle"), url: "../imgs/Triangle_Flare_Banner.webp"},
        {elem: document.querySelector("#parallax-background"), url: "../imgs/super_nova_nebula_black_hole_with_neurons.webp"}
    ];

    let loadedImages = 0;
    for (let i = 0; i < elemsWithImages.length; i++) {
        const img = new Image();
        img.onload = function() {
            loadedImages++;
            elemsWithImages[i].elem.style.backgroundImage = `url(${elemsWithImages[i].url})`;
            if (loadedImages === elemsWithImages.length) {
                for (let j = 0; j < elemsWithImages.length; j++) {
                    elemsWithImages[j].elem.classList.remove("parralax-preload");
                }
                startAnimation();
            }
        };
        img.src = elemsWithImages[i].url;
    }

    const elems = elemsWithImages.map(obj => obj.elem);
    let depthFactors = [0.005, 0.1, 0.18, .3];
    const bias = -15.0;
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

    // Maximum movement should be a percentage of window's height
    const maxMovement = window.innerHeight * 0.5;

    function startAnimation() {
        let startTime = performance.now(); // start time
        function animate(time) {
            let timeFraction = (time - startTime) / DURATION; // calculate the fraction of time that has passed
            if (timeFraction > 1) timeFraction = 1;

            let newY = maxMovement * easeInOutCubic(timeFraction); // apply the easing function to the time fraction
            let backgroundPositions = calculateDepth(x, newY);

            for (let i = 0; i < elems.length; i++) {
                let elem = elems[i];
                let backgroundPosition = backgroundPositions[i];
                // console.log(x, newY, backgroundPosition);
                elem.style.backgroundPosition = backgroundPosition;
                elem.style.opacity = timeFraction; // change the opacity over time
            }

            if (timeFraction < 1) { // stop the animation after 1 second
                requestAnimationFrame(animate);
            }
        }

        // Start the animation
        requestAnimationFrame(animate);
    }
})();
