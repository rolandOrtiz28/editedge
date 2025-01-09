function animatePath(selector, delay = 0) {
  if (window.innerWidth > 768) { // Only animate on screens larger than 768px
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
  } else {
    // Remove lines entirely for mobile
    document.querySelectorAll(selector).forEach((path) => {
      path.style.display = "none";
    });
  }
}

animatePath(".connector-path-ce");
animatePath(".connector-path-td", 1);
animatePath(".connector-path-ae", 2);

// Reapply animation on window resize
window.addEventListener("resize", () => {
  animatePath(".connector-path-ce");
  animatePath(".connector-path-td", 1);
  animatePath(".connector-path-ae", 2);
});


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


// Improved map loading performance
mapboxgl.accessToken = "pk.eyJ1Ijoicm9sYW5kMjgiLCJhIjoiY201NmxhMGZ6MHNxcDJrc2c4NnNvd25weSJ9.FW6t7CihNZT10Af4V_sw-g";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/satellite-streets-v12",
  center: [125.00149725399824, 11.214530716578475],
  zoom: 15,
});
const marker1 = new mapboxgl.Marker().setLngLat([125.00149725399824, 11.214530716578475]).addTo(map);


document.addEventListener("DOMContentLoaded", () => {
  const columns = document.querySelectorAll(".review-column");

  columns.forEach((column, columnIndex) => {
    const wrapper = column.querySelector(".reviews-wrapper");
    const reviews = Array.from(wrapper.children);
    const reviewHeight = reviews[0].offsetHeight + 20; // Add spacing
    let index = 0;

    // Clone first and last reviews for seamless looping
    const firstClone = reviews[0].cloneNode(true);
    const lastClone = reviews[reviews.length - 1].cloneNode(true);
    wrapper.appendChild(firstClone);
    wrapper.insertBefore(lastClone, reviews[0]);

    wrapper.style.transform = `translateY(-${reviewHeight}px)`; // Adjust for initial position

    setInterval(() => {
      index++;
      wrapper.style.transition = "transform 0.8s ease";
      wrapper.style.transform = `translateY(-${(index + 1) * reviewHeight}px)`;

      // Reset to seamless loop
      if (index >= reviews.length) {
        setTimeout(() => {
          wrapper.style.transition = "none";
          wrapper.style.transform = `translateY(-${reviewHeight}px)`;
          index = 0;
        }, 800);
      }
    }, 7000 + columnIndex * 500); // Add staggered delay per column
  });
});