document.addEventListener("DOMContentLoaded", function () {
  const swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    initialSlide: 2, // Ensures the middle card is at the start
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 200,
      modifier: 1,
      slideShadows: false,
    },
    loop: false, // Loop disabled for proper sequential swiping
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
});

  
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  // Service Cards Floating Animation with Delay
  gsap.utils.toArray(".service-card").forEach((card, i) => {
      gsap.fromTo(
          card,
          { y: 150 + i * 20, opacity: 0, scale: 0.8 },
          {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1.5,
              ease: "power4.out",
              delay: i * 0.2,
              scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                  end: "bottom 60%",
                  scrub: 2,
              },
          }
      );
  });

  // Process Steps Floating Effect with Delay
  gsap.utils.toArray(".process-step").forEach((step, i) => {
      gsap.fromTo(
          step,
          { y: 150 + i * 20, opacity: 0, scale: 0.8 },
          {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1.8,
              ease: "power4.out",
              delay: i * 0.2,
              scrollTrigger: {
                  trigger: step,
                  start: "top 85%",
                  end: "bottom 60%",
                  scrub: 2,
              },
          }
      );
  });
});