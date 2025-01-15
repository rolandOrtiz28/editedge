  // Register GSAP ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Function to animate SVG paths
  function animatePath(selector, delay = 0) {
    if (window.innerWidth > 768) { // Only animate on larger screens
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
            scrub: 0.5,
          },
        });
      });
    } else {
      // Hide paths on mobile
      document.querySelectorAll(selector).forEach((path) => {
        path.style.display = "none";
      });
    }
  }

  // Call animation functions
  animatePath(".connector-path-ce");
  animatePath(".connector-path-td", 1);
  animatePath(".connector-path-ae", 2);

  // Reapply animations on window resize
  window.addEventListener("resize", () => {
    animatePath(".connector-path-ce");
    animatePath(".connector-path-td", 1);
    animatePath(".connector-path-ae", 2);
  });

  // Animate infographic items
  gsap.utils.toArray(".infographic-item").forEach((item) => {
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

  // Gallery animations
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

  // Smooth zoom for project gallery
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

  // Pause scrolling on hover for gallery columns
  document.querySelectorAll(".gallery-column").forEach((column) => {
    column.addEventListener("mouseenter", () => {
      column.style.animationPlayState = "paused";
    });
    column.addEventListener("mouseleave", () => {
      column.style.animationPlayState = "running";
    });
  });

  // Animate customer logos with scrub
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
      },
    }
  );

  // Animate whychooseus section
  gsap.fromTo(
    ".whychooseus-section .caption",
    { opacity: 0, scale: 0.8 },
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

  // Animate services section
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
      },
    }
  );

  // Animate team cards
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