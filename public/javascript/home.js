// GSAP and ScrollTrigger initialization
gsap.registerPlugin(ScrollTrigger);

// Function to animate paths
function animatePath(selector, delay = 0) {
  const paths = document.querySelectorAll(selector);

  paths.forEach((path) => {
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
        scrub: 0.5,
      },
    });
  });
}

// Function to initialize animations
function initializeAnimations() {
  // Kill all GSAP animations and ScrollTriggers
  gsap.killTweensOf("*");
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  // Check if the screen width is less than 768px (phone size)
  if (window.innerWidth < 768) {
    return; // Exit function without initializing animations
  }

  // Add your GSAP animations here as before
  animatePath(".connector-path-ce");
  animatePath(".connector-path-td", 1);
  animatePath(".connector-path-ae", 2);

  gsap.utils.toArray(".infographic-item").forEach((item) => {
    gsap.from(item, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: item.closest(".infographic-row"),
        start: "top 80%",
        end: "center 50%",
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
        duration: 1.2,
        ease: "power1.out",
        scrollTrigger: {
          trigger: img,
          start: "top 90%",
          end: "top 60%",
          toggleActions: "play none none none",
        },
      }
    );
  });

  gsap.fromTo(
    ".project-gallery",
    { scale: 0.8 },
    {
      scale: 1,
      duration: 2,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: ".project-gallery",
        start: "top 80%",
        end: "bottom 20%",
        scrub: true,
      },
    }
  );

  gsap.fromTo(
    ".logos-grid img",
    {
      opacity: 0,
      scale: 0.8,
    },
    {
      opacity: 1,
      scale: 1,
      stagger: 0.3,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".customer-logos-section",
        start: "top 90%",
        end: "bottom 60%",
        scrub: true,
      },
    }
  );

  gsap.fromTo(
    ".whychooseus-section .caption",
    {
      opacity: 0,
      scale: 0.8,
    },
    {
      opacity: 1,
      scale: 1,
      stagger: 0.3,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".whychooseus-section",
        start: "top 90%",
        end: "bottom 60%",
        scrub: true,
      },
    }
  );

  gsap.fromTo(
    ".services-section .caption2",
    {
      opacity: 0,
      scale: 0.8,
    },
    {
      opacity: 1,
      scale: 1,
      stagger: 0.3,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".services-section",
        start: "top 90%",
        end: "bottom 60%",
        scrub: true,
      },
    }
  );

  gsap.from(".team-cards .cards", {
    y: 50,
    opacity: 0,
    stagger: 0.3,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".our-team-section",
      start: "top 80%",
      end: "bottom 20%",
      scrub: true,
    },
  });

  gsap.from(".services-container .glass", {
    y: 50,
    opacity: 0,
    stagger: 0.3,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".glass",
      start: "top 80%",
      end: "top 50%",
      scrub: true,
    },
  });

  gsap.from(".our-team-section .our-team-caption", {
    y: 50,
    opacity: 0,
    stagger: 0.3,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".our-team-section",
      start: "top 80%",
      end: "top 50%",
      scrub: true,
    },
  });

  gsap.fromTo(
    ".project-gallery",
    {
      opacity: 0,
    },
    {
      opacity: 1,
      stagger: 0.3,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".project-gallery",
        start: "top 90%",
        end: "bottom 60%",
        scrub: true,
      },
    }
  );
}

// Debounced resize event listener
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    initializeAnimations();
  }, 200);
});

// Initialize animations on window load
window.addEventListener("load", initializeAnimations);

// Lazy-load Mapbox for performance
setTimeout(() => {
  mapboxgl.accessToken = "pk.eyJ1Ijoicm9sYW5kMjgiLCJhIjoiY201NmxhMGZ6MHNxcDJrc2c4NnNvd25weSJ9.FW6t7CihNZT10Af4V_sw-g";
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/satellite-streets-v12",
    center: [125.00149725399824, 11.214530716578475],
    zoom: 15,
  });
  new mapboxgl.Marker().setLngLat([125.00149725399824, 11.214530716578475]).addTo(map);
}, 2000);

// Smooth pause/resume for gallery animations
document.querySelectorAll(".gallery-column").forEach((column) => {
  column.addEventListener("mouseenter", () => {
    column.style.animationPlayState = "paused";
  });

  column.addEventListener("mouseleave", () => {
    column.style.animationPlayState = "running";
  });
});

// Review section with seamless looping
document.addEventListener("DOMContentLoaded", () => {
  const columns = document.querySelectorAll(".review-column");

  columns.forEach((column, columnIndex) => {
    const wrapper = column.querySelector(".reviews-wrapper");
    const reviews = Array.from(wrapper.children);
    const reviewHeight = reviews[0].offsetHeight + 20; // Add spacing
    let index = 0;

    const firstClone = reviews[0].cloneNode(true);
    const lastClone = reviews[reviews.length - 1].cloneNode(true);
    wrapper.appendChild(firstClone);
    wrapper.insertBefore(lastClone, reviews[0]);

    wrapper.style.transform = `translateY(-${reviewHeight}px)`; // Initial position

    setInterval(() => {
      index++;
      wrapper.style.transition = "transform 0.8s ease";
      wrapper.style.transform = `translateY(-${(index + 1) * reviewHeight}px)`;

      if (index >= reviews.length) {
        setTimeout(() => {
          wrapper.style.transition = "none";
          wrapper.style.transform = `translateY(-${reviewHeight}px)`;
          index = 0;
        }, 800);
      }
    }, 7000 + columnIndex * 500);
  });
});
