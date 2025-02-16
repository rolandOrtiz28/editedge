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
                    <img src="/images/chatbot-icon.png" alt="Eddie AI" class="bot-avatar">
                    <p class="bot-message"><strong>Eddie:</strong> ${formatMessage(botReply)}</p>
                </div>`;
    
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
        } catch (error) {
            hideTypingIndicator();
            console.error("Chatbot Error:", error);
        }
    }
});
