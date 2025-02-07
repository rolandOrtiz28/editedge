document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger);
  
    gsap.utils.toArray(".service-card").forEach((card, i) => {
      gsap.fromTo(card, { y: 150 + i * 20, opacity: 0, scale: 0.8 }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power4.out",
        delay: i * 0.2,
        scrollTrigger: { trigger: card, start: "top 85%", end: "bottom 60%", scrub: 2 }
      });
    });
  });
  

  document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelectorAll(".swiper-slide");
    const middleIndex = Math.floor(slides.length / 2); // Ensures the center slide starts in front

    const swiper = new Swiper(".mySwiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 5, // Ensures 2 slides on each side
        initialSlide: middleIndex, // Always starts in the center
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 200,
            modifier: 1.5,
            slideShadows: false,
        },
        loop: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });

    // Click to Expand Image Fullscreen
    slides.forEach(slide => {
        slide.addEventListener("click", function () {
            if (!this.classList.contains("swiper-slide-active")) {
                swiper.slideTo(this.dataset.swiperSlideIndex); // Move clicked slide to center
            } else {
                openFullscreen(this.querySelector("img").src);
            }
        });
    });
});

// Function to Open Image in Fullscreen (Modal)
function openFullscreen(imageSrc) {
    const modal = document.createElement("div");
    modal.classList.add("image-modal");
    modal.innerHTML = `
        <div class="modal-content">
            <img src="${imageSrc}" alt="Full Size Image">
            <span class="close-modal">&times;</span>
        </div>
    `;
    document.body.appendChild(modal);

    // Close Modal on Click
    modal.querySelector(".close-modal").addEventListener("click", () => {
        modal.remove();
    });
}
