document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    const content = document.getElementById("content");

    if (content) {
        content.style.visibility = "visible"; // ✅ Ensures content is not hidden
        content.style.opacity = "1";
    }

    if (loader) {
        loader.classList.add("fade-out");

        setTimeout(() => {
            loader.style.display = "none"; 
        }, 1000);
    }
});

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
    
            // ✅ Remove unnecessary responses
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

document.addEventListener("DOMContentLoaded", function () {
    let hasEddieSpoken = sessionStorage.getItem("hasEddieSpoken") === "true";
    const buttonScene = new THREE.Scene();
    const buttonCamera = new THREE.PerspectiveCamera(90, 1, 0.1, 100);
    const buttonRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    buttonRenderer.setSize(80, 80);
    const chatbotToggle = document.getElementById("chatbot-toggle");
    if (!chatbotToggle) {
        console.error("❌ Element #chatbot-toggle not found!");
    } else {
        chatbotToggle.appendChild(buttonRenderer.domElement);
    }

    const buttonLight = new THREE.AmbientLight(0xffffff, 1);
    buttonScene.add(buttonLight);

    const buttonLoader = new THREE.GLTFLoader();
    let buttonModel = null;

    buttonLoader.load("/assets/chatbot_4.glb", function (gltf) {
        if (buttonModel) {
            console.warn("⚠️ Eddie is already loaded in the button. Skipping duplicate.");
            return;
        }
    
        buttonModel = gltf.scene;
    
        // ✅ Fix: Remove duplicate meshes (Extra eyes issue)
        const seenMeshes = new Set();
        buttonModel.traverse((child) => {
            if (child.isMesh) {
                // If we already saw this mesh, remove the duplicate
                if (seenMeshes.has(child.name)) {
                    console.warn("🛑 Removing duplicate mesh:", child.name);
                    child.parent.remove(child);
                } else {
                    seenMeshes.add(child.name);
                }
    
                // Ensure correct material rendering
                child.material.side = THREE.DoubleSide;
                child.material.needsUpdate = true;
            }
        });
    
        buttonModel.scale.set(9, 9, 9);
        buttonModel.position.set(0, -2, -6);
        buttonScene.add(buttonModel);
    
        let waveOffset = 0;
        function animateButton() {
            requestAnimationFrame(animateButton);
            waveOffset += -0.01;
            buttonModel.rotation.z = Math.sin(waveOffset) * 0.1; // Side-to-side animation
            buttonRenderer.render(buttonScene, buttonCamera);
        }
        animateButton();
    
        makeDraggable(buttonModel, buttonCamera, buttonRenderer, buttonScene);
    });
    

    buttonCamera.position.z = 3.5;

    
    if (!hasEddieSpoken) {
        sessionStorage.setItem("hasEddieSpoken", "true"); // Store in session storage
        setTimeout(() => {
            document.getElementById("speech-bubble").style.opacity = "1";
        }, 1000);

        setTimeout(() => {
            document.getElementById("speech-bubble").style.opacity = "0";
        }, 4000);
    }
});


function makeDraggable(model, camera, renderer, scene) {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    renderer.domElement.addEventListener("mousedown", (event) => {
        isDragging = true;
        previousMousePosition = { x: event.clientX, y: event.clientY };
    });

    renderer.domElement.addEventListener("mousemove", (event) => {
        if (!isDragging) return;
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;

        model.rotation.y += deltaX * 0.01;
        model.rotation.x += deltaY * 0.01;

        previousMousePosition = { x: event.clientX, y: event.clientY };
    });

    renderer.domElement.addEventListener("mouseup", () => {
        isDragging = false;
    });

    renderer.domElement.addEventListener("mouseleave", () => {
        isDragging = false;
    });

    // ✅ Support for Touchscreens
    renderer.domElement.addEventListener("touchstart", (event) => {
        isDragging = true;
        previousMousePosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    });

    renderer.domElement.addEventListener("touchmove", (event) => {
        if (!isDragging) return;
        const deltaX = event.touches[0].clientX - previousMousePosition.x;
        const deltaY = event.touches[0].clientY - previousMousePosition.y;

        model.rotation.y += deltaX * 0.01;
        model.rotation.x += deltaY * 0.01;

        previousMousePosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    });

    renderer.domElement.addEventListener("touchend", () => {
        isDragging = false;
    });
}


