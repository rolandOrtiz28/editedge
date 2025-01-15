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


// Reapply animation on window resize
window.addEventListener("resize", () => {
  animatePath(".connector-path-ce");
  animatePath(".connector-path-td", 1);
  
});

function animatePath2(selector, delay = 0) {
  if (window.innerWidth > 768) { // Only animate on screens larger than 768px
    document.querySelectorAll(selector).forEach((path) => {
      const length = path.getTotalLength();

      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;

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


animatePath2(".connector-path-ae", 2);

// Reapply animation on window resize
window.addEventListener("resize", () => {
  
  animatePath2(".connector-path-ae", 2);
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
// GSAP animations for gallery
// Smooth fade-in and zoom for individual gallery images
gsap.utils.toArray(".gallery-column img").forEach((img) => {
  gsap.fromTo(
    img,
    { opacity: 0, scale: 0.9 },
    {
      opacity: 1,
      scale: 1,
      duration: 1.2, // Increased duration for smoother animation
      ease: "power1.out", // Smoother easing
      scrollTrigger: {
        trigger: img,
        start: "top 90%",
        end: "top 60%", // Added an end trigger for better control
        toggleActions: "play none none none",
      },
    }
  );
});

// Unified smooth zoom for the entire project gallery
gsap.fromTo(
  ".project-gallery",
  { scale: 0.8 }, // Start zoomed-out state
  {
    scale: 1, // Zoom back to normal
    duration: 2, // Gradual zoom over longer duration
    ease: "power1.inOut", // Smooth easing in both directions
    scrollTrigger: {
      trigger: ".project-gallery",
      start: "top 80%",
      end: "bottom 20%",
      scrub: true, // Enable scrub for scroll-synced zoom
    },
  }
);


// Pause scrolling on hover
document.querySelectorAll(".gallery-column").forEach((column) => {
  column.addEventListener("mouseenter", () => {
    column.style.animationPlayState = "paused";
  });

  column.addEventListener("mouseleave", () => {
    column.style.animationPlayState = "running";
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

gsap.registerPlugin(ScrollTrigger);

// Animate logos with scrub enabled
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
      start: "top 90%", // Adjust trigger point for better visibility
      end: "bottom 60%",
      scrub: true, // Enable scrub for smooth scrolling
     
    },
  }
);
gsap.fromTo(
  ".customer-logos-header",
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
      start: "top 90%", // Adjust trigger point for better visibility
      end: "bottom 60%",
      scrub: true, // Enable scrub for smooth scrolling
    
    },
  }
);

// Whychooseus
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
      start: "top 90%", // Adjust trigger point for better visibility
      end: "bottom 60%",
      scrub: true, // Enable scrub for smooth scrolling
     
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
      start: "top 90%", // Adjust trigger point for better visibility
      end: "bottom 60%",
      scrub: true, // Enable scrub for smooth scrolling
    
    },
  }
);

// offersection
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
      start: "top 90%", // Adjust trigger point for better visibility
      end: "bottom 60%",
      scrub: true, // Enable scrub for smooth scrolling
     
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
      start: "top 90%", // Adjust trigger point for better visibility
      end: "bottom 60%",
      scrub: true, // Enable scrub for smooth scrolling
    
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
    scrub: true, // Enable scrub for smooth scrolling animation
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
    scrub: true, // Enable scrub for smooth scrolling animation
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
    scrub: true, // Enable scrub for smooth scrolling animation
  },
});


// offersection
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
      start: "top 90%", // Adjust trigger point for better visibility
      end: "bottom 60%",
      scrub: true, // Enable scrub for smooth scrolling
     
    },
  }
);
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
      start: "top 90%", // Adjust trigger point for better visibility
      end: "bottom 60%",
      scrub: true, // Enable scrub for smooth scrolling
    
    },
  }
);

