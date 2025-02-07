document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger);
  
    gsap.utils.toArray(".service-card").forEach((card, i) => {
      gsap.fromTo(card, { y: 100, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          end: "bottom 60%",
          scrub: 2,
        },
      });
    });
  });
  