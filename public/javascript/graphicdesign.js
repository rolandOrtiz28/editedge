document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  // ✅ Detect Screen Size (Disable GSAP on Mobile)
  const isMobile = window.innerWidth <= 768;

  if (!isMobile) {
      // ✅ Service Cards Floating Animation (Only on Desktop)
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
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // ✅ Initialize Swiper (Works on all screen sizes)
  const swiper = new Swiper(".mySwiper", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      initialSlide: Math.floor(document.querySelectorAll(".swiper-slide").length / 2), // Ensures center card
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
          768: { slidesPerView: 2, coverflowEffect: { depth: 150 } }, // Tablets
          480: { slidesPerView: 1, coverflowEffect: { depth: 100 } }, // Phones
      },
  });
});

// ✅ Function to Open Image in Fullscreen (Modal)
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


document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".swiper-slide img");

    // Create fullscreen overlay
    const fullscreenOverlay = document.createElement("div");
    fullscreenOverlay.style.position = "fixed";
    fullscreenOverlay.style.top = "0";
    fullscreenOverlay.style.left = "0";
    fullscreenOverlay.style.width = "100vw";
    fullscreenOverlay.style.height = "100vh";
    fullscreenOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    fullscreenOverlay.style.display = "none";
    fullscreenOverlay.style.justifyContent = "center";
    fullscreenOverlay.style.alignItems = "center";
    fullscreenOverlay.style.zIndex = "1000";
    fullscreenOverlay.style.cursor = "pointer";

    const fullscreenImage = document.createElement("img");
    fullscreenImage.style.maxWidth = "90%";
    fullscreenImage.style.maxHeight = "90%";
    fullscreenImage.style.borderRadius = "10px";

    fullscreenOverlay.appendChild(fullscreenImage);
    document.body.appendChild(fullscreenOverlay);

    images.forEach(img => {
        img.addEventListener("click", function () {
            fullscreenImage.src = this.src;
            fullscreenOverlay.style.display = "flex";
        });
    });

    // Close fullscreen when clicking the overlay
    fullscreenOverlay.addEventListener("click", function () {
        fullscreenOverlay.style.display = "none";
    });

    // Close on ESC key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            fullscreenOverlay.style.display = "none";
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    document.getElementById("num1").innerText = num1;
    document.getElementById("num2").innerText = num2;
    document.getElementById("captchaCorrectAnswer").value = num1 + num2;
  });