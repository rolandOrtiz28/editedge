
document.addEventListener("DOMContentLoaded", () => {

    const loader = document.getElementById("loader");
    const content = document.getElementById("content");
  
   
    window.onload = () => {
      if (loader) {
        // Fade out loader
        loader.classList.add("fade-out");
        setTimeout(() => {
          loader.style.display = "none"; 
          if (content) {

            content.style.visibility = "visible";
            content.style.opacity = "1";
          }
        }, 1000); 
      }
    };
    });

    
    document.addEventListener("DOMContentLoaded", function () {
        const chatbotToggle = document.getElementById("chatbot-toggle");
        const chatbotWindow = document.getElementById("chatbot-window");
        const closeChatbot = document.getElementById("close-chatbot");
        const minimizeChatbot = document.getElementById("minimize-chatbot");
        const chatbotInput = document.getElementById("chatbot-input");
        const chatbotSend = document.getElementById("chatbot-send");
        const chatbotMessages = document.getElementById("chatbot-messages");
    
        // ✅ Toggle Chatbot (Show/Hide)
        chatbotToggle.addEventListener("click", function () {
            chatbotWindow.style.display = chatbotWindow.style.display === "flex" ? "none" : "flex";
        });
    
        // ✅ Close Chatbot (Clears Messages)
        closeChatbot.addEventListener("click", function () {
            chatbotWindow.style.display = "none";
            chatbotMessages.innerHTML = ""; // Clears chat history when closed
        });
    
        // ✅ Minimize Chatbot (Hides but Retains Messages)
        minimizeChatbot.addEventListener("click", function () {
            chatbotWindow.style.display = "none"; // Hide the chatbox
        });
    
        chatbotSend.addEventListener("click", sendMessage);
        chatbotInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") sendMessage();
        });
    
        function formatMessage(text) {
            return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                       .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
        }
    
        async function sendMessage() {
            const userMessage = chatbotInput.value.trim();
            if (!userMessage) return;
    
            chatbotMessages.innerHTML += `<p class="user-message"><strong>You:</strong> ${userMessage}</p>`;
            chatbotInput.value = "";
    
            try {
                const response = await fetch("/chatbot", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: userMessage })
                });
    
                const data = await response.json();
                chatbotMessages.innerHTML += `<p class="bot-message"><strong>Eddie:</strong> ${formatMessage(data.reply)}</p>`;
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            } catch (error) {
                console.error("Chatbot Error:", error);
            }
        }
    });
    
    