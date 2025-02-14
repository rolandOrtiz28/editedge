const express = require('express');
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BUSINESS_INFO = `
### Company Overview
EditEdge Multimedia is a full-service creative agency offering **Video Editing, Web Development, Graphic Design, 3D Art, and Digital Marketing**.

📍 **Location:** Tacloban City, Philippines  
📧 **Email:** info@editedgemultimedia.com  
🌍 **Website:** [editedgemultimedia.com](https://www.editedgemultimedia.com)  

### Services
- **[Video Editing](https://editedgemultimedia.com/#services)** → Social media videos, corporate promos, animations, and more.  
- **[Web Development](https://editedgemultimedia.com/#services)** → Custom websites, e-commerce, and SEO-optimized pages.  
- **[Graphic Design](https://editedgemultimedia.com/#services)** → Branding, UI/UX, marketing materials, and social media graphics.  
- **[3D Art & Animation](https://editedgemultimedia.com/#services)** → Product rendering, architectural visualization, and motion graphics.  
- **[Digital Marketing](https://editedgemultimedia.com/#services)** → SEO, social media campaigns, branding, and email marketing.

📌 **For a full list of services, visit:**  
[View All Services](https://editedgemultimedia.com/#services)

### Pricing & Promotions
- **Price Range:** $50 - $3,000+ per service.  
- **Discounts:** Bundle deals:  
  - Web + Graphics → **10% off**  
  - 3D + Video Editing → **15% off**  
  - Digital Suite (3+ services) → **20% off**  

📌 **For full pricing details, visit:**  
[View Pricing](https://editedgemultimedia.com/#pricing)

### Contact Details
📧 **Email:** info@editedgemultimedia.com  
📞 **Phone:** +639773938580  
🌍 **Website:** [Contact Us](https://editedgemultimedia.com/#contact)

### Contact Details
**Quotation:** [Request quotation](https://editedgemultimedia.com/quotation)
`;

async function generateResponse(userMessage) {
    let fullResponse = "";
    let nextMessage = null;

    do {
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: nextMessage ? [{ role: "user", content: nextMessage }] : [
                { 
                    role: "system", 
                    content: `You are Eddie, the AI assistant for EditEdge Multimedia.
                    ALWAYS introduce yourself as Eddie when responding.
                    
                    When a user asks about services, provide the correct service link:
                    - Video Editing → [Video Editing](https://editedgemultimedia.com/#services)
                    - Web Development → [Web Development](https://editedgemultimedia.com/#services)
                    - Graphic Design → [Graphic Design](https://editedgemultimedia.com/#services)
                    - 3D Art & Animation → [3D Art](https://editedgemultimedia.com/#services)
                    - Digital Marketing → [Digital Marketing](https://editedgemultimedia.com/#services)

                    If the user asks about pricing, respond with:
                    "For a detailed breakdown, check our pricing page here: [View Pricing](https://editedgemultimedia.com/#pricing)."

                    If you don’t have an answer, **DO NOT** make unnecessary statements.
                    Instead, say:  
                    "I'm not entirely sure, but you can reach out to us here: [Contact Us](https://editedgemultimedia.com/#contact)."

                    **Do NOT say anything about past conversations.**
                    **Do NOT say anything unrelated to EditEdge Multimedia.**
                    
                    Here is everything you need to know:
                    ${BUSINESS_INFO}`
                },
                { role: "user", content: userMessage }
            ],
            max_tokens: 250,  // Limit per response
        });

        const responseText = response.choices[0].message.content;
        fullResponse += responseText; // Append to the total response

        // Check if response is cut off
        nextMessage = responseText.length >= 240 ? "Continue from where you left off." : null;

    } while (nextMessage); // Loop if message is incomplete

    return fullResponse;
}

router.post("/chatbot", async (req, res) => {
    try {
        const userMessage = req.body.message.trim();
        if (!userMessage) {
            return res.json({ reply: "Please enter a message!" });
        }

        const fullReply = await generateResponse(userMessage);
        res.json({ reply: fullReply });

    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
});
  
router.get("/chatbot", (req, res) => {
    res.render("chatbot/chatbot", { currentRoute: "/chatbot" });
});
  
module.exports = router;
