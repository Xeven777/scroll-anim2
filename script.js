const canvas = document.getElementById("frame");
const ctx = canvas.getContext("2d");
const frames = {
    currentIndex: 0,
    maxIndex: 140
};
let imagesLoaded = 0;
const images = [];

gsap.registerPlugin(ScrollTrigger);
function preloadImages() {
    for (let i = 1; i <= frames.maxIndex; i++) {
        const img = new Image();
        img.src = `./frames/frame_${i.toString().padStart(4, "0")}.jpeg`;
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === frames.maxIndex) {
                console.log("All images loaded");
                startAnimations();
            }
        };
        images.push(img);
    }
}

function loadImages(index) {
    if (index >= 0 && index <= frames.maxIndex) {
        const img = images[index];
        if (!img || !img.complete) return;

        const canvasRect = canvas.getBoundingClientRect();
        canvas.width = canvasRect.width;
        canvas.height = canvasRect.height;
        const scaleX = canvas.width / img.width;
        const scaleY = canvas.height / img.height;
        const scale = Math.max(scaleX, scaleY);

        const offsetX = (canvas.width - img.width * scale) / 2;
        const offsetY = (canvas.height - img.height * scale) / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingQuality = "high";
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, offsetX, offsetY, img.width * scale, img.height * scale);
        frames.currentIndex = index;
    }
}

function startAnimations() {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".parent",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            pin: true
        }
    });

    tl.to(frames, {
        currentIndex: frames.maxIndex,
        ease: "none",
        onUpdate: () => {
            console.log("Current index: ", frames.currentIndex);
            if (frames.currentIndex >= 0 && frames.currentIndex <= frames.maxIndex) {
                loadImages(Math.floor(frames.currentIndex));
            }
        }
    });
}

preloadImages();