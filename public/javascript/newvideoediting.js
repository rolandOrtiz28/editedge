document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger);


    const isMobile = window.innerWidth <= 768;

  if (!isMobile) {
    // Service Cards Floating Animation with Delay
    gsap.utils.toArray(".service-card").forEach((card, i) => {
        gsap.fromTo(
            card,
            { y: 120 + i * 30, opacity: 0, scale: 0.8 },
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

    // Process Steps Floating Effect
    gsap.utils.toArray(".process-step").forEach((step, i) => {
        gsap.fromTo(
            step,
            { y: 120 + i * 30, opacity: 0, scale: 0.8 },
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
}
});


document.addEventListener("DOMContentLoaded", function () {
    const mainVideo = document.getElementById("main-video");
    const videoTitle = document.getElementById("video-title");
    const videoItems = document.querySelectorAll(".video-item");

    videoItems.forEach(item => {
        item.addEventListener("click", function () {
            const videoSrc = this.getAttribute("data-video");
            const title = this.getAttribute("data-title");
            mainVideo.src = videoSrc;
            mainVideo.play();
            videoTitle.textContent = title;

            document.querySelector(".video-item.active")?.classList.remove("active");
            this.classList.add("active");
        });
    });

    gsap.registerPlugin(ScrollTrigger);

    // Staggered Floating Animation for Video Items
    // gsap.utils.toArray(".video-item").forEach((video, i) => {
    //     gsap.fromTo(
    //         video,
    //         { y: 80 + i * 5, opacity: 0, scale: 0.9 },
    //         {
    //             y: 0,
    //             opacity: 1,
    //             scale: 1,
    //             duration: 1.5,
    //             ease: "power4.out",
    //             delay: i * 0.15,
    //             scrollTrigger: {
    //                 trigger: video,
    //                 start: "top 90%",
    //                 end: "bottom 50%",
    //                 scrub: 2,
    //             },
    //         }
    //     );
    // });
});


document.addEventListener("DOMContentLoaded", function () {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    document.getElementById("num1").innerText = num1;
    document.getElementById("num2").innerText = num2;
    document.getElementById("captchaCorrectAnswer").value = num1 + num2;
  });