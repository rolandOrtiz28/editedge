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
    const swiper = new Swiper(".mySwiper", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      initialSlide: Math.floor(document.querySelectorAll('.swiper-slide').length / 2), // Ensures center card
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 150,
        modifier: 1,
        slideShadows: false,
      },
      loop: false, // Looping off for better control
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        1024: { slidesPerView: 3, coverflowEffect: { depth: 200 } }, // Large screens
        768: { slidesPerView: 2, coverflowEffect: { depth: 150 } },  // Tablets
        480: { slidesPerView: 1, coverflowEffect: { depth: 100 } },  // Phones
      }
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
