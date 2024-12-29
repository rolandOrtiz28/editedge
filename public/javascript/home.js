const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Ensure canvas matches video dimensions and position
video.addEventListener('loadedmetadata', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const adjustPosition = () => {
        const videoRect = video.getBoundingClientRect();
        canvas.style.width = `${videoRect.width}px`;
        canvas.style.height = `${videoRect.height}px`;
        canvas.style.top = `${videoRect.top}px`;
        canvas.style.left = `${videoRect.left}px`;
    };

    adjustPosition();
    window.addEventListener('resize', adjustPosition); // Recalculate on window resize
});

video.addEventListener('play', () => {
    function removeBlackBackground() {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = frame.data;

        // Iterate through each pixel
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            // If the pixel is black (or close to black), make it transparent
            if (r < 30 && g < 30 && b < 30) {
                pixels[i + 3] = 0; // Set the alpha channel to 0 (transparent)
            }
        }

        // Put the modified frame back on the canvas
        ctx.putImageData(frame, 0, 0);

        // Repeat the process for the next frame
        requestAnimationFrame(removeBlackBackground);
    }

    removeBlackBackground();
});

gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll(".connector-path-ce").forEach((path) => {
  const length = path.getTotalLength(); // Get the full length of the path

  // Set initial stroke properties for continuous stroke (no dash pattern)
  path.style.strokeDasharray = length; // Set dash array to full path length
  path.style.strokeDashoffset = -length; // Start the stroke from the right (off-screen)

  // Animate the stroke to reveal it from right to left
  gsap.to(path, {
    strokeDashoffset: 0, // Animate from right to left, revealing the stroke
    duration: 1.5, // Duration of the reveal animation
    ease: "power2.inOut", // Smooth easing for animation
    scrollTrigger: {
      trigger: path.closest(".infographic-row"), // Trigger on scroll when this row enters the viewport
      start: "top 80%", // Trigger the animation when 80% of the section is in view
      toggleActions: "restart pause resume none", // Scroll-triggered animation behavior
      
    },
  });
});

gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll(".connector-path-td").forEach((path) => {
  const length = path.getTotalLength(); // Get the full length of the path

  // Set initial stroke properties for continuous stroke (no dash pattern)
  path.style.strokeDasharray = length; // Set dash array to full path length
  path.style.strokeDashoffset = -length; // Start the stroke from the right (off-screen)

  // Animate the stroke to reveal it from right to left
  gsap.to(path, {
    strokeDashoffset: 0, // Animate from right to left, revealing the stroke
    duration: 1.5, // Duration of the reveal animation
    ease: "power2.inOut", // Smooth easing for animation
    delay: 1,
    scrollTrigger: {
      trigger: path.closest(".infographic-row"), // Trigger on scroll when this row enters the viewport
      start: "top 80%", // Trigger the animation when 80% of the section is in view
      toggleActions: "restart pause resume none", // Scroll-triggered animation behavior
    },
  });
});


gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll(".connector-path-ae").forEach((path) => {
  const length = path.getTotalLength(); // Get the full length of the path

  // Set initial stroke properties for continuous stroke (no dash pattern)
  path.style.strokeDasharray = length; // Set dash array to full path length
  path.style.strokeDashoffset = length; // Start the stroke from the right (off-screen)

  // Animate the stroke to reveal it from right to left
  gsap.to(path, {
    strokeDashoffset: 0, // Animate from right to left, revealing the stroke
    duration: 1.5, // Duration of the reveal animation
    ease: "power2.inOut", // Smooth easing for animation
    delay: 2,
    scrollTrigger: {
      trigger: path.closest(".infographic-row"), // Trigger on scroll when this row enters the viewport
      start: "top 80%", // Trigger the animation when 80% of the section is in view
      toggleActions: "restart pause resume none", // Scroll-triggered animation behavior
      
    },
  });
});



// Slide-up animation for each infographic item
gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll(".infographic-item").forEach((item, index) => {
  gsap.from(item, {
    y: 50, // Start slightly below the original position
    opacity: 0, // Start fully transparent
    duration: 1, // Duration of the animation
    ease: "power2.out", // Smooth easing
    delay: index * 1, // Stagger effect for sequential animations
    scrollTrigger: {
      trigger: item.closest(".infographic-row"), // Trigger animation when the row enters the viewport
      start: "top 80%", // Start animation when 80% of the row is visible
      toggleActions: "restart pause resume none", // Scroll-triggered animation behavior
    },
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const animatedText = document.querySelector(".animated-text");

  // Start with erasing "Adequacy"
  animatedText.style.animation = "erasing 2s steps(9, end) forwards";

  // Replace with "Excellence" after erasing
  setTimeout(() => {
    animatedText.textContent = "Excellence";
    animatedText.style.animation = "typing 2s steps(9, end) forwards";
  }, 2000); // Wait for the erasing animation to complete
});


document.addEventListener("DOMContentLoaded", function () {
  const gallery = document.querySelector(".project-gallery");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Section is in view, start the animation
          gallery.classList.remove("paused");
          document.querySelectorAll(".scroll-content").forEach((el) => {
            el.style.animationPlayState = "running";
          });
        } else {
          // Section is out of view, pause the animation
          gallery.classList.add("paused");
          document.querySelectorAll(".scroll-content").forEach((el) => {
            el.style.animationPlayState = "paused";
          });
        }
      });
    },
    { threshold: 0.2 } // Trigger when 20% of the section is visible
  );

  observer.observe(gallery);
});


mapboxgl.accessToken = 'pk.eyJ1Ijoicm9sYW5kMjgiLCJhIjoiY201NmxhMGZ6MHNxcDJrc2c4NnNvd25weSJ9.FW6t7CihNZT10Af4V_sw-g';
const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    center: [125.00149725399824, 11.214530716578475],
    zoom: 15
});


const marker1 = new mapboxgl.Marker()
    .setLngLat([125.00149725399824, 11.214530716578475])
    .addTo(map);
