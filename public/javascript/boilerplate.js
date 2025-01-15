document.addEventListener("DOMContentLoaded", () => {
    // Initialize the loader
    const loader = document.getElementById("loader");
    const content = document.getElementById("content");
  
    // Ensure the loader fades out smoothly after the window is fully loaded
    window.onload = () => {
      if (loader) {
        // Fade out loader
        loader.classList.add("fade-out");
        setTimeout(() => {
          loader.style.display = "none"; // Completely hide the loader after fading out
          if (content) {
            // Make content visible after loader disappears
            content.style.visibility = "visible";
            content.style.opacity = "1";
          }
        }, 1000); // Adjust timeout to match the fade-out animation duration
      }
    };
  
    // Initialize Particles.js
    particlesJS("particles-js", {
      particles: {
        number: { value: 160, density: { enable: true, value_area: 800 } },
        color: { value: "#C7F464" },
        shape: { type: "circle" },
        opacity: { value: 0.2, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 1, direction: "none", random: true, out_mode: "out" }
      },
      interactivity: {
        events: {
          onhover: { enable: true, mode: "bubble" },
          onclick: { enable: true, mode: "repulse" }
        },
        modes: {
          bubble: { distance: 250, duration: 2 },
          repulse: { distance: 400 }
        }
      },
      retina_detect: true
    });
  });
  