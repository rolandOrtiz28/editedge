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
    duration: 0.8, // Shorter duration
    ease: "power2.out",
    scrollTrigger: {
      trigger: item.closest(".infographic-row"),
      start: "top 80%",
      end: "top 50%",
      scrub: 0.5, // Reduced scrub intensity
    },
  });
});

gsap.to(".project-gallery", {
  scale: 0.8, // Zoom in effect
  scrollTrigger: {
    trigger: ".project-gallery",
    start: "top 80%",
    end: "bottom 20%",
    scrub: true, // Smooth zoom effect on scroll
  },
});

gsap.to(".project-gallery", {
  scale: 1, // Zoom out effect
  scrollTrigger: {
    trigger: ".project-gallery",
    start: "bottom 80%",
    end: "top 20%",
    scrub: true,
  },
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
