// Combine path animations into one function
gsap.registerPlugin(ScrollTrigger);

function animatePath(selector, delay = 0) {
  document.querySelectorAll(selector).forEach((path) => {
    const length = path.getTotalLength();

    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = -length;

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: "power2.inOut",
      delay: delay,
      scrollTrigger: {
        trigger: path.closest(".infographic-row"),
        start: "top 80%",
        end: "bottom 20%",
        scrub: 0.5, // Reduced scrub intensity
      },
    });
  });
}

animatePath(".connector-path-ce");
animatePath(".connector-path-td", 1);
animatePath(".connector-path-ae", 2);

// Optimize infographic item animations
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".infographic-item").forEach((item, index) => {
  gsap.from(item, {
    y: 50,
    opacity: 0,
    duration: 0.8, 
    ease: "power2.out",
    scrollTrigger: {
      trigger: item.closest(".infographic-row"),
      start: "top 80%",
      end: "top 50%",
      scrub: 0.5, 
  
    },
  });
});

gsap.utils.toArray(".gallery-column img").forEach((img) => {
  gsap.fromTo(
    img,
    { opacity: 0, scale: 0.9 },
    {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: img,
        start: "top 90%",
        toggleActions: "play none none none",
       
      },
    }
  );
});

// Smooth zoom for the entire project gallery
gsap.to(".project-gallery", {
  scale: 0.8,
  scrollTrigger: {
    trigger: ".project-gallery",
    start: "top 80%",
    end: "bottom 20%",
    scrub: true,
  },
});

gsap.to(".project-gallery", {
  scale: 1,
  scrollTrigger: {
    trigger: ".project-gallery",
    start: "bottom 80%",
    end: "top 20%",
    scrub: true,
  },
});

document.querySelectorAll(".gallery-column").forEach((column) => {
  column.addEventListener("mouseenter", () => {
    column.style.animationPlayState = "paused"; // Pause animation
  });

  column.addEventListener("mouseleave", () => {
    column.style.animationPlayState = "running"; // Resume animation
  });
});

// JavaScript to reset scrolling animation
document.querySelectorAll(".gallery-content").forEach((content) => {
  content.addEventListener("animationiteration", () => {
    content.style.animation = "none";
    requestAnimationFrame(() => {
      content.style.animation = "";
    });
  });
});

gsap.utils.toArray(".services-container .glass").forEach((box, index) => {
  gsap.from(box, {
    y: -200, // Start position above the viewport
    opacity: 0, // Start fully transparent
    duration: 1, // Duration of the drop animation
    ease: "bounce.out", // Bounce effect for the drop
    delay: index * 0.2, // Stagger the animations for each box
    scrollTrigger: {
      trigger: "#services", // Trigger animation when #services section comes into view
      start: "top 80%", // Start when the section is 80% visible
      end: "center 20%", // Start when the section is 80% visible
      scrub:true,
    },
  });
});

// Hover effect: Align boxes neatly
const servicesContainer = document.querySelector(".services-container");
servicesContainer.addEventListener("mouseenter", () => {
  gsap.to(".services-container .glass", {
    x: (i) => i * 200 - 300, // Distribute horizontally with proper spacing
    y: 0, // Align vertically
    rotation: 0, // Reset rotation
    duration: 0.5,
    ease: "power2.out",
  });
});

// Reset random formation on hover out
servicesContainer.addEventListener("mouseleave", () => {
  gsap.to(".services-container .glass", {
    x: 0, // Reset horizontal position
    y: 0, // Reset vertical position
    rotation: gsap.utils.random(-15, 15), // Random tilt
    duration: 0.5,
    ease: "power2.out",
  });
});

// Improved map loading performance
mapboxgl.accessToken = "pk.eyJ1Ijoicm9sYW5kMjgiLCJhIjoiY201NmxhMGZ6MHNxcDJrc2c4NnNvd25weSJ9.FW6t7CihNZT10Af4V_sw-g";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/satellite-streets-v12",
  center: [125.00149725399824, 11.214530716578475],
  zoom: 15,
});
const marker1 = new mapboxgl.Marker().setLngLat([125.00149725399824, 11.214530716578475]).addTo(map);
