gsap.registerPlugin(ScrollTrigger);

// ✅ Optimize Horizontal Line Animation (Plays Once)
gsap.to(".horizontal-line", {
  width: "100%",
  duration: window.innerWidth < 768 ? 3 : 8,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".process-section",
    start: "top 85%",
    toggleActions: "play none none none", // ✅ Plays once, does not replay
    once: true, // ✅ Ensures it runs only one time
  },
});

// ✅ Optimize Process Steps Animation (Plays Once)
gsap.utils.toArray(".process-step").forEach((step, index) => {
  gsap.fromTo(
    step,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: window.innerWidth < 768 ? 2 : 4,
      ease: "power3.out",
      delay: index * (window.innerWidth < 768 ? 0.3 : 1),
      scrollTrigger: {
        trigger: step,
        start: "top 85%",
        toggleActions: "play none none none", // ✅ Plays once, does not replay
        once: true, // ✅ Ensures it runs only one time
      },
    }
  );
});

// ✅ Refresh ScrollTrigger on Resize (Optimized)
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    ScrollTrigger.refresh();
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
