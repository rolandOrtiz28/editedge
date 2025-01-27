
gsap.registerPlugin(ScrollTrigger);


// function typeWriterAnimation(targetElement) {
//   const textContent = targetElement.textContent; 
//   targetElement.textContent = ""; 

//   let index = 0;


//   ScrollTrigger.create({
//     trigger: targetElement,
//     start: "top 80%",
//     onEnter: () => {
//       const interval = setInterval(() => {
//         targetElement.textContent += textContent[index];
//         index++;

//         if (index === textContent.length) {
//           clearInterval(interval); 
//         }
//       }, 70); 
//     },
//     once: true, 
//   });
// }


// document.querySelectorAll(".description").forEach((description) => {
//   typeWriterAnimation(description);
// });

// Animate the horizontal line
gsap.to(".horizontal-line", {
  width: "100%", // Animate width from 0% to 100%
  duration: window.innerWidth < 768 ? 5 : 13, // Shorter duration for smaller screens
  ease: "power2.out", // Smooth easing
  scrollTrigger: {
    trigger: ".process-section", // Trigger when the section is in view
    start: "top 80%", // Start animation when 80% of section is visible
    toggleActions: "play none none none", // Trigger only once
  },
});

// Animate each step
gsap.utils.toArray(".process-step").forEach((step, index) => {
  gsap.fromTo(
    step,
    { opacity: 0, y: 50 }, // Start hidden and slightly below
    {
      opacity: 1, // Fade in
      y: 0, // Move to original position
      duration: window.innerWidth < 768 ? 4 : 8, // Shorter duration for smaller screens
      ease: "power2.out", // Smooth easing
      delay: index * (window.innerWidth < 768 ? 0.5 : 1.5), // Adjust stagger for smaller screens
      scrollTrigger: {
        trigger: step, // Trigger each step individually
        start: "top 80%", // Start when 80% of step is visible
        toggleActions: "play none none none", // Trigger only once
      },
    }
  );
});

// Reinitialize animations on resize
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    ScrollTrigger.refresh(); // Refresh ScrollTrigger to adapt to new screen size
  }, 200);
});


var myCarousel = document.getElementById('graphicDesignCarousel');
var carousel = new bootstrap.Carousel(myCarousel, {
  interval: 5000, // Auto-slide every 3 seconds
  ride: 'carousel'
});
