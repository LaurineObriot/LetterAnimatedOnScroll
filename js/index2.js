
// Lenis smooth scrolling
let lenis;

const preloadFonts = (id) => {
    return new Promise((resolve) => {
        WebFont.load({
            typekit: {
                id: id
            },
            active: resolve
        });
    });
};

// Initialize Lenis smooth scrolling
const initSmoothScrolling = () => {
	
    lenis = new Lenis({
		lerp: 0.2,
		smooth: true
	});

    lenis.on('scroll', () => ScrollTrigger.update());

	const scrollFn = (time) => {
		lenis.raf(time);
		requestAnimationFrame(scrollFn);
	};
	
    requestAnimationFrame(scrollFn);

};

const animateWords = el => {
    
    // from: https://www.npmjs.com/package/split-type#splitting-text 
    // Important: The following style should be applied to all target elements. This prevents the characters from shifting slightly when text is split/reverted.
    gsap.set(el, {'font-kerning': 'none'});

    // Apply SplitType
    const st = new SplitType(el, { types: 'lines, words' });
    
    const lines = st.lines;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: el,
            start: 'center center',
            end: '+=300%',
            scrub: true,
            pin: el
        }
    })
    .set(el, {perspective: 1000});

    for (const [linepos,line] of lines.entries()) {
        
        gsap.set(line, {transformStyle: 'preserve-3d'});

        const words = line.querySelectorAll('.word');
        
        tl
        .to(words, {
            ease: 'power2',
            opacity: 0,
            xPercent: (pos,_,arr) => pos < arr.length/2 ? Math.abs(pos-arr.length/2)*gsap.utils.random(-40,-10) : Math.abs(pos-arr.length/2)*gsap.utils.random(10,40),
            yPercent: (pos,_,arr) => Math.abs(pos-arr.length/2)*gsap.utils.random(-80,-40)-150,
            rotationY: (pos,_,arr) => pos > arr.length/2 ? Math.abs(pos-arr.length/2)*-15 : Math.abs(pos-arr.length/2)*15,
            z: (pos,_,arr) => Math.abs(pos - arr.length/2) ? gsap.utils.random(-40,-20) : gsap.utils.random(20,40),
            stagger: {
                each: 0.01,
                from: 'edges'
            },
            
        }, linepos*.05);

    }
    
};

// GSAP Scroll Triggers
const scroll = () => {
    [...document.querySelectorAll('[data-split]')].forEach(el => {
        animateWords(el)
    });
};

// Preload images and fonts
preloadFonts('lce3oen').then(() => {
    // Remove loader (loading class)
    document.body.classList.remove('loading');
    // Lenis (smooth scrolling)
    initSmoothScrolling();
    // GSAP Scroll Triggers
    scroll();
});


