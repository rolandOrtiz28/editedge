document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger);

    // ✅ Smooth Scrolling
    document.querySelectorAll(".cta-button").forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            window.location.href = this.getAttribute("href");
        });
    });

    // ✅ Scroll Glow Effect
    const headerText = document.querySelector(".glow-text");
    window.addEventListener("scroll", function () {
        let scrollPosition = window.scrollY;
        headerText.style.textShadow = `0 0 ${20 + scrollPosition / 5}px #FF007F`;
    });

    // ✅ Counter Animation (Intersection Observer)
    const counters = document.querySelectorAll(".counter");
    const speed = 200; // Animation speed

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute("data-target");
                let count = 0;
                const increment = target / speed;

                const updateCounter = () => {
                    count = Math.min(count + increment, target);
                    entry.target.innerText = entry.target.classList.contains("percentage")
                        ? Math.ceil(count) + "%"
                        : Math.ceil(count).toLocaleString();

                    if (count < target) {
                        requestAnimationFrame(updateCounter);
                    }
                };

                updateCounter();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));

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

        // ✅ Process Steps Floating Effect (Only on Desktop)
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
    }

    // ✅ Lazy Load Videos using Intersection Observer
    let videos = document.querySelectorAll(".lazy-video");
    let videoObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let video = entry.target;
                let source = video.querySelector("source");
                if (source.dataset.src) {
                    source.src = source.dataset.src;
                    video.load();
                }
                videoObserver.unobserve(video);
            }
        });
    }, { threshold: 0.3 });

    videos.forEach(video => videoObserver.observe(video));
});
