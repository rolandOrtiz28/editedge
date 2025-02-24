document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  // ✅ Detect Screen Size (Disable GSAP on Mobile)
  const isMobile = window.innerWidth <= 768;

  if (!isMobile) {
    // ✅ Optimize Horizontal Line Animation (Only on Desktop)
    gsap.to(".horizontal-line", {
      width: "100%",
      duration: 8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".process-section",
        start: "top 85%",
        toggleActions: "play none none none", // ✅ Plays once, does not replay
        once: true, // ✅ Ensures it runs only one time
      },
    });

    // ✅ Optimize Process Steps Animation (Only on Desktop)
    gsap.utils.toArray(".process-step").forEach((step, index) => {
      gsap.fromTo(
        step,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 4,
          ease: "power3.out",
          delay: index * 1,
          scrollTrigger: {
            trigger: step,
            start: "top 85%",
            toggleActions: "play none none none", // ✅ Plays once, does not replay
            once: true, // ✅ Ensures it runs only one time
          },
        }
      );
    });

     
  //    gsap.utils.toArray(".service-card").forEach((card, i) => {
  //     gsap.fromTo(
  //         card,
  //         { y: 150 + i * 20, opacity: 0, scale: 0.8 },
  //         {
  //             y: 0,
  //             opacity: 1,
  //             scale: 1,
  //             duration: 1.5,
  //             ease: "power4.out",
  //             delay: i * 0.2,
  //             scrollTrigger: {
  //                 trigger: card,
  //                 start: "top 85%",
  //                 end: "bottom 60%",
  //                 scrub: 2,
  //             },
  //         }
  //     );
  // });


  // gsap.utils.toArray(".process-step").forEach((step, i) => {
  //     gsap.fromTo(
  //         step,
  //         { y: 150 + i * 20, opacity: 0, scale: 0.8 },
  //         {
  //             y: 0,
  //             opacity: 1,
  //             scale: 1,
  //             duration: 1.8,
  //             ease: "power4.out",
  //             delay: i * 0.2,
  //             scrollTrigger: {
  //                 trigger: step,
  //                 start: "top 85%",
  //                 end: "bottom 60%",
  //                 scrub: 2,
  //             },
  //         }
  //     );
  // });
  }
});

// ✅ Refresh ScrollTrigger on Resize (Ensures GSAP Only Runs on Desktop)
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) {
      ScrollTrigger.refresh();
    }
  }, 250);
});

// ✅ Optimize Bootstrap Carousel
document.addEventListener("DOMContentLoaded", function () {
  new bootstrap.Carousel("#graphicDesignCarousel", {
    interval: 5000,
    ride: "carousel",
  });

  // ✅ Optimize Video Player Interaction
  const mainVideo = document.getElementById("main-video");
  const videoTitle = document.getElementById("video-title");

  document.querySelectorAll(".video-item").forEach((item) => {
    item.addEventListener("click", function () {
      document.querySelector(".video-item.active")?.classList.remove("active");
      this.classList.add("active");

      mainVideo.src = this.getAttribute("data-video");
      mainVideo.play();
      videoTitle.textContent = this.getAttribute("data-title");
    });
  });
});
