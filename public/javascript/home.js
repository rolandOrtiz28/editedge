gsap.registerPlugin(ScrollTrigger);


function animatePath(selector, delay = 0) {
  const paths = document.querySelectorAll(selector);

  paths.forEach((path) => {
    if (!path) return; // Avoid errors if elements are missing

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
        once: true, // Prevents re-triggering
      },
    });
  });
}


function initializeAnimations() {
  gsap.killTweensOf("*"); 
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); 

  if (window.innerWidth < 768) return; 


  animatePath(".connector-path-ce");
  animatePath(".connector-path-td", 1);
  animatePath(".connector-path-ae", 2);


  gsap.utils.toArray(".infographic-item").forEach((item) => {
    if (item.getBoundingClientRect().top > window.innerHeight) return;

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
        once: true,
      },
    });
  });

  // ✅ Optimize image animations
  gsap.utils.toArray(".gallery-column img").forEach((img) => {
    gsap.fromTo(
      img,
      { opacity: 0, scale: 1.1 },
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
          once: true,
        },
      }
    );
  });

  // ✅ Optimize project gallery animation
  gsap.fromTo(
    ".project-gallery",
    { scale: 1.5 },
    {
      scale: 1.1,
      duration: 2,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: ".project-gallery",
        start: "top 80%",
        end: "center 20%",
        scrub: true,
      },
    }
  );

  // ✅ Optimize logos-grid animation
  gsap.fromTo(
    ".logos-grid img",
    { opacity: 0, scale: 0.8 },
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
        once: true,
      },
    }
  );

  // ✅ Optimize services-section animation
  gsap.fromTo(
    ".services-section .caption2",
    { opacity: 0, scale: 0.8 },
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
        once: true,
      },
    }
  );

  // ✅ Optimize services-container animation
  gsap.from(".services-container .glass", {
    y: 20, /* ✅ Reduced movement to prevent flicker */
    opacity: 0,
    stagger: 0.2, /* ✅ Faster stagger for smoother reveal */
    duration: 0.8, /* ✅ Slightly faster animation */
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".services-container",
      start: "top 85%",
      end: "top 60%",
      scrub: true,
      once: true,
    },
  });

  // ✅ Optimize team-card animation
  gsap.from(".team-card", {
    y: 50,
    opacity: 0,
    stagger: 0.3,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".our-team-section",
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none none",
      once: true,
    },
  });

  // ✅ Clear transform on hover
  document.querySelectorAll(".glass").forEach((glass) => {
    glass.addEventListener("mouseenter", () => {
      gsap.set(glass, { clearProps: "transform" });
    });
  });
}

// ✅ Debounced Resize Event for Optimization
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(initializeAnimations, 200);
});

// ✅ Lazy Load GSAP Animations Only When Needed
window.addEventListener("load", initializeAnimations);

// ✅ Lazy Load Mapbox Only When Needed
document.addEventListener("DOMContentLoaded", function () {
  let mapLoaded = false;
  window.addEventListener("scroll", function () {
    if (!mapLoaded && document.querySelector("#map")) {
      let script = document.createElement("script");
      script.src = "https://api.mapbox.com/mapbox-gl-js/v3.9.1/mapbox-gl.js";
      script.defer = true;
      document.body.appendChild(script);

      script.onload = function () {
        mapboxgl.accessToken = "your-token";
        const map = new mapboxgl.Map({
          container: "map",
          style: "mapbox://styles/mapbox/satellite-streets-v12",
          center: [125.00149725399824, 11.214530716578475],
          zoom: 15,
        });
        new mapboxgl.Marker().setLngLat([125.00149725399824, 11.214530716578475]).addTo(map);
      };
      mapLoaded = true;
    }
  });
});

// ✅ Pause Gallery Animation on Hover
document.querySelectorAll(".gallery-column").forEach((column) => {
  column.addEventListener("mouseenter", () => column.style.animationPlayState = "paused");
  column.addEventListener("mouseleave", () => column.style.animationPlayState = "running");
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
