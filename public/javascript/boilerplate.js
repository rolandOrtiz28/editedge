(function() {
    function revealContent() {
      const loader = document.getElementById("loader");
      const content = document.getElementById("content");
  
      if (content) {
        content.style.visibility = "visible";
        content.style.opacity = "1";
      }
  
      if (loader) {
        loader.classList.add("fade-out");
        setTimeout(() => {
          loader.style.display = "none";
        }, 1000);
      }
    }
  
    // Fallback: force reveal after 5 seconds in case load event never fires
    const fallbackTimeout = setTimeout(() => {
      console.log("Fallback timeout triggered.");
      revealContent();
    }, 5000);
  
    // If the document is already loaded, run immediately; otherwise, wait for Turbo's load event.
    if (document.readyState === "complete") {
      clearTimeout(fallbackTimeout);
      console.log("Document already loaded.");
      revealContent();
    } else {
      // Listen for Turbo's load event.
      document.addEventListener("turbo:load", () => {
        console.log("Turbo load event triggered.");
        clearTimeout(fallbackTimeout);
        if (document.readyState === "complete") {
          revealContent();
        } else {
          window.addEventListener("load", revealContent);
        }
      });
    }
  })();
  

document.addEventListener("DOMContentLoaded", function () {
    const chatbotToggle = document.getElementById("chatbot-toggle");
    const chatbotWindow = document.getElementById("chatbot-window");
    const closeChatbot = document.getElementById("close-chatbot");
    const minimizeChatbot = document.getElementById("minimize-chatbot");
    const chatbotInput = document.getElementById("chatbot-input");
    const chatbotSend = document.getElementById("chatbot-send");
    const chatbotMessages = document.getElementById("chatbot-messages");

    chatbotToggle.addEventListener("click", function () {
        chatbotWindow.style.display = chatbotWindow.style.display === "flex" ? "none" : "flex";
    });

    minimizeChatbot.addEventListener("click", function () {
        chatbotWindow.style.display = "none"; 
    });

    closeChatbot.addEventListener("click", function () {
        chatbotWindow.style.display = "none"; 
        chatbotMessages.innerHTML = ""; 
    });

    chatbotSend.addEventListener("click", sendMessage);
    chatbotInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") sendMessage();
    });

    function formatMessage(text) {
        return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                   .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: #ffd9ec; text-decoration: underline;">$1</a>');
    }

    function showTypingIndicator() {
        const typingIndicator = document.createElement("div");
        typingIndicator.classList.add("typing-container");
        typingIndicator.innerHTML = `<span class="loader2"></span>`;
        chatbotMessages.appendChild(typingIndicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    function hideTypingIndicator() {
        const typingIndicator = document.querySelector(".typing-container");
        if (typingIndicator) typingIndicator.remove();
    }

    async function sendMessage() {
        const userMessage = chatbotInput.value.trim();
        if (!userMessage) return;
    
        chatbotMessages.innerHTML += `<p class="user-message"><strong>You:</strong> ${userMessage}</p>`;
        chatbotInput.value = "";
    
        showTypingIndicator();
    
        try {
            const response = await fetch("/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage })
            });
    
            const data = await response.json();
            hideTypingIndicator();
    
            let botReply = data.reply;
    
          
            const blacklistPhrases = [
                "I don't have an active session",
                "I can't recall past conversations",
                "there doesn't seem to be an ongoing discussion",
                "I'm sorry, but I can't remember",
                "Could you provide more details?"
            ];
    
            for (const phrase of blacklistPhrases) {
                if (botReply.includes(phrase)) {
                    botReply = "I'm here to help! You can contact us directly here: [Contact Us](https://editedgemultimedia.com/contact).";
                    break;
                }
            }
    
            chatbotMessages.innerHTML += `
                <div class="chat-message">
                    <img src="https://res.cloudinary.com/dowyujl8h/image/upload/f_auto,q_auto,w_800/v1740017134/Eddie_eeubkc.png" alt="Eddie AI" class="bot-avatar">
                    <p class="bot-message"><strong>Eddie:</strong> ${formatMessage(botReply)}</p>
                </div>`;
    
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
        } catch (error) {
            hideTypingIndicator();
            console.error("Chatbot Error:", error);
        }
    }
});

// document.addEventListener("DOMContentLoaded", function () {
//     let hasEddieSpoken = sessionStorage.getItem("hasEddieSpoken") === "true";
//     const buttonScene = new THREE.Scene();
//     const buttonCamera = new THREE.PerspectiveCamera(90, 1, 0.1, 100);
//     const buttonRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

//     buttonRenderer.setSize(100, 100);
//     const chatbotToggle = document.getElementById("chatbot-toggle");
//     if (!chatbotToggle) {
//         console.error("❌ Element #chatbot-toggle not found!");
//     } else {
//         chatbotToggle.appendChild(buttonRenderer.domElement);
//     }

//     const buttonLight = new THREE.AmbientLight(0xffffff, 1);
//     buttonScene.add(buttonLight);

//     const buttonLoader = new THREE.GLTFLoader();
//     let buttonModel = null;

//     function enableEyeTracking(model) {
//       let eddieEyes = [];
  
//       // 🎯 Select the correct eye objects
//       model.traverse((child) => {
//           if (child.name === "1" || child.name === "2" || child.name === "3") {  
//               console.log(`👀 Eye Tracking Enabled for: ${child.name}`);
//               eddieEyes.push({ mesh: child, originalPosition: child.position.clone() }); // ✅ Store original position
//           }
//       });
  
//       if (eddieEyes.length === 0) {
//           console.warn("⚠️ No eye mesh found! Skipping eye tracking.");
//           return;
//       }
  
//       // 🎯 Make Eyes Follow Cursor (Without Leaving the Head)
//       document.addEventListener("mousemove", (event) => {
//           const rect = chatbotToggle.getBoundingClientRect();
//           const x = ((event.clientX - rect.left) / rect.width) * 2 - 1; // Normalize X (-1 to 1)
//           const y = ((event.clientY - rect.top) / rect.height) * 2 - 1; // Normalize Y (-1 to 1)
  
//           const movementRange = 0.04; // ✅ **New Limit: Max movement range**
  
//           // ✅ Move eyes slightly within their original position range
//           eddieEyes.forEach((eye) => {
//               const newX = eye.originalPosition.x + x * movementRange;
//               const newY = eye.originalPosition.y - y * movementRange;
  
//               // ✅ **Clamp values so eyes don’t leave the head**
//               eye.mesh.position.x = Math.max(eye.originalPosition.x - movementRange, Math.min(newX, eye.originalPosition.x + movementRange));
//               eye.mesh.position.y = Math.max(eye.originalPosition.y - movementRange, Math.min(newY, eye.originalPosition.y + movementRange));
//           });
//       });
//   }
  

//     buttonLoader.load("/assets/chatbot_export.glb", function (gltf) {
//       if (buttonModel) {
//         console.warn("⚠️ Eddie is already loaded in the button. Skipping duplicate.");
//         return;
//     }
//       buttonModel = gltf.scene;
//       let eddieHead = null; 
//       let mixer = null; // 🎥 Animation mixer
  
  
//       // ✅ Start Animation if Available
//       if (gltf.animations.length > 0) {
//         mixer = new THREE.AnimationMixer(buttonModel); // Create mixer
    
//         // ✅ Play all animations (including hands)
//         gltf.animations.forEach((clip) => {
//             const action = mixer.clipAction(clip);
//             action.setLoop(THREE.LoopRepeat, 3); // ✅ Play 3 times
//             action.setEffectiveTimeScale(0.5); // ✅ Slow down
//             action.setEffectiveWeight(1);
//             action.clampWhenFinished = true;
//             action.play();
//             console.log(`🎬 Playing Animation: ${clip.name}`);
//         });
    
//         // ✅ When animation finishes, reset Eddie to default standing pose
//         mixer.addEventListener("finished", () => {
//           console.log("🎬 Animation finished! Forcing Eddie back to standing pose.");
      
//           // 🔹 STOP all current animations
//           mixer.stopAllAction();
      
//           // 🔹 Force Eddie's whole model to reset position & rotation
//           buttonModel.position.set(0, 2.5, 2); // ✅ Move Eddie back to his original spot
//           buttonModel.rotation.set(0, 0, 0);   // ✅ Reset rotation
      
//           // 🔹 If Eddie has bones, reset their rotations too
//           buttonModel.traverse((child) => {
//               if (child.isBone || child.isMesh) {
//                   child.rotation.set(0, 0, 0); // ✅ Reset each part to neutral
//               }
//           });
      
//           console.log("✅ Eddie is now back to standing!");
      
//           // ✅ Enable Eye Tracking after resetting pose
//           enableEyeTracking(buttonModel);
//       });     
//     }
//       // ✅ Adjust Scale & Position for Correct Visibility
//       buttonModel.scale.set(4, 4, 4);
//       buttonModel.position.set(0, 2.5, 2);
  
//       // ✅ Ensure Proper Lighting
//       const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
//       directionalLight.position.set(2, 5, 5);
//       buttonScene.add(directionalLight);
  
//       buttonScene.add(buttonModel);
  
//       // ✅ Camera Fix: Adjust Field of View & Position
//       buttonCamera.fov = 50;
//       buttonCamera.position.set(0, 0, 30);
//       buttonCamera.updateProjectionMatrix();
  
//       // 🎥 Update function to play animation smoothly
//       function animateButton() {
//           requestAnimationFrame(animateButton);
          
//           if (mixer) {
//               mixer.update(0.016); // Update animation at ~60FPS
//           }
  
//           buttonRenderer.render(buttonScene, buttonCamera);
//       }
//       animateButton();
  
     
//   });
  

//     buttonCamera.position.z = 3.5;

    
//     if (!hasEddieSpoken) {
//         sessionStorage.setItem("hasEddieSpoken", "true"); 
//         setTimeout(() => {
//             document.getElementById("speech-bubble").style.opacity = "1";
//         }, 1000);

//         setTimeout(() => {
//             document.getElementById("speech-bubble").style.opacity = "0";
//         }, 4000);
//     }
// });



// document.addEventListener("DOMContentLoaded", function () {
//     let hasEddieSpoken = sessionStorage.getItem("hasEddieSpoken") === "true";
// if (!hasEddieSpoken) {
//     sessionStorage.setItem("hasEddieSpoken", "true"); 
//     setTimeout(() => {
//         document.getElementById("speech-bubble").style.opacity = "1";
//     }, 1000);

//     setTimeout(() => {
//         document.getElementById("speech-bubble").style.opacity = "0";
//     }, 4000);
// }
// });