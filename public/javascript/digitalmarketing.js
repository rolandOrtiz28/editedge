document.addEventListener("DOMContentLoaded", function () {
    // Smooth Scrolling
    document.querySelectorAll('.cta-button').forEach(button => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        const target = this.getAttribute("href");
        window.location.href = target;
      });
    });
  
    // Scroll Glow Effect
    const headerText = document.querySelector(".glow-text");
    window.addEventListener("scroll", function () {
      let scrollPosition = window.scrollY;
      headerText.style.textShadow = `0 0 ${20 + scrollPosition / 5}px #FF007F`;
    });
  });
  

  document.addEventListener("DOMContentLoaded", function () {
    const counters = document.querySelectorAll(".counter");
    const speed = 200; // Adjust speed for the animation

    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const target = +entry.target.getAttribute("data-target");
                    let count = 0;
                    const increment = target / speed;

                    const updateCounter = () => {
                        if (count < target) {
                            count += increment;
                            entry.target.innerText =
                                entry.target.classList.contains("percentage")
                                    ? Math.ceil(count) + "%" // Add "%" if class exists
                                    : Math.ceil(count).toLocaleString();
                            setTimeout(updateCounter, 10);
                        } else {
                            entry.target.innerText =
                                entry.target.classList.contains("percentage")
                                    ? target + "%" // Final number with "%"
                                    : target.toLocaleString();
                        }
                    };

                    updateCounter();
                    observer.unobserve(entry.target); // Stop observing after animation
                }
            });
        },
        { threshold: 0.5 } // Start animation when 50% of the section is visible
    );

    counters.forEach((counter) => observer.observe(counter));
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