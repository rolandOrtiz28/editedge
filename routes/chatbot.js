const express = require('express');
const router = express.Router();
const session = require("express-session");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.use(session({
    secret: "chatbot_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 5 * 60 * 1000 } 
}));

const BUSINESS_INFO = `
### Company Overview
EditEdge Multimedia is a full-service creative agency offering **Video Editing, Web Development, Graphic Design, 3D Art, and Digital Marketing**.

📍 **Location:** Tacloban City, Philippines  
📧 **Email:** info@editedgemultimedia.com  
🌍 **Website:** [editedgemultimedia.com](https://editedgemultimedia.com)  

### Services
- **[Video Editing](https://editedgemultimedia.com/Video-Editing)** → Social media videos, corporate promos, animations, and more.  
- **[Web Development](https://editedgemultimedia.com/Web-Development)** → Custom websites, e-commerce, and SEO-optimized pages.  
- **[Graphic Design](https://editedgemultimedia.com/Graphic-Design)** → Branding, UI/UX, marketing materials, and social media graphics.  
- **[3D Art & Animation](https://editedgemultimedia.com/3D-Art)** → Product rendering, architectural visualization, and motion graphics.  
- **[Digital Marketing](https://editedgemultimedia.com/Digital-Marketing)** → SEO, social media campaigns, branding, and email marketing.

📌 **For a full list of services, visit:**  
[View All Services](https://editedgemultimedia.com/services)

### Pricing & Promotions
- **Price Range:** $50 - $3,000+ per service.  
- **Discounts:** Bundle deals:  
  - Web + Graphics → **10% off**  
  - 3D + Video Editing → **15% off**  
  - Digital Suite (3+ services) → **20% off**  

📌 **For full pricing details, visit:**  
[View Pricing](https://editedgemultimedia.com/pricing)

### Contact Details
📧 **Email:** info@editedgemultimedia.com  
📞 **Phone:** +639773938580  
🌍 **Website:** [Contact Us](https://editedgemultimedia.com/contact)

### Quotation
**Request a Quote:** [Request quotation](https://editedgemultimedia.com/quotation)
`;

router.post("/chatbot", async (req, res) => {
    try {
        const userMessage = req.body.message.trim();
        if (!userMessage) {
            return res.json({ reply: "Please enter a message!" });
        }

        // ✅ Initialize session-based chat history if not exists
        if (!req.session.chatHistory) {
            req.session.chatHistory = [
                { role: "system", content: `You are Eddie, the AI assistant for EditEdge Multimedia.
                    You must ALWAYS introduce yourself and answer ONLY based on the company details.
                    DO NOT make up answers or mention previous conversations.
                    DO NOT say you "don't have memory" or "can't recall past conversations."
                    ONLY use details provided in the business info.

                    📌 **Strict Response Rules**:
                    - **If asked about services**, include the correct service link:
                      - [Video Editing](https://editedgemultimedia.com/Video-Editing)
                      - [Web Development](https://editedgemultimedia.com/Web-Development)
                      - [Graphic Design](https://editedgemultimedia.com/Graphic-Design)
                      - [3D Art & Animation](https://editedgemultimedia.com/3D-Art)
                      - [Digital Marketing](https://editedgemultimedia.com/Digital-Marketing)

                    - **If asked about pricing**, refer them to:  
                      **[View Pricing](https://editedgemultimedia.com/pricing)**  

                    - **If they ask about contact info**, provide:  
                      **[Contact Us](https://editedgemultimedia.com/#contact)**  

                    ❌ **Do NOT answer anything outside the company info.**
                    ❌ **Do NOT say 'I don’t remember' or 'I can't recall past interactions'.**
                    ❌ **If a question is unclear, redirect them to [Contact Us](https://editedgemultimedia.com/#contact).** 

                    Here is all company information:
                    ${BUSINESS_INFO}`
                }
            ];
        }

        // ✅ Add user message to session history
        req.session.chatHistory.push({ role: "user", content: userMessage });

        // ✅ Send chat history to OpenAI for context
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: req.session.chatHistory,
            max_tokens: 500,  
        });

        let botReply = response.choices[0].message.content;

        // ✅ Filter out unwanted phrases (same as before)
        const blacklistPhrases = [
            "I don't have an active session",
            "I can't recall past conversations",
            "there doesn't seem to be an ongoing discussion",
            "I'm sorry, but I can't remember",
            
        ];

        for (const phrase of blacklistPhrases) {
            if (botReply.includes(phrase)) {
                botReply = "I'm here to help! You can contact us directly here: [Contact Us](https://editedgemultimedia.com/#contact).";
                break;
            }
        }

        // ✅ Store bot response in chat history
        req.session.chatHistory.push({ role: "assistant", content: botReply });

        res.json({ reply: botReply });

    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
});

  
module.exports = router;
