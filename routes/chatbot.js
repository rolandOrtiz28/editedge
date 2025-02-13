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

### Founders & Team
- **Founder:** Roland Ortiz – Web Developer & Video Editor.  
- **Co-Founder:** Roland Kristian Ortiz – 3D Artist & Graphic Designer.  
- **Business Development Manager:** Danzel Brent Basada – Website Admin & SEO Specialist.  
- **Other Team Members:** Davino Paula Basada (Social Media Manager), Chris Estaron (Full-Stack Developer), Enrique C. Titong III (SEO Specialist).  

### Services
✅ Video Editing – Social media videos, corporate promos, animations, and more.  
💻 Web Development – Custom websites, e-commerce, and SEO-optimized pages.  
🎨 Graphic Design – Branding, UI/UX, marketing materials, and social media graphics.  
🏗 3D Art & Animation – Product rendering, architectural visualization, and motion graphics.  
📈 Digital Marketing – SEO, social media campaigns, branding, and email marketing.

### Pricing & Promotions
- 💰 **Price Range:** $50 - $3,000+ per service.  
- 📢 **Discounts:** Bundle deals:  
  - Web + Graphics → **10% off**  
  - 3D + Video Editing → **15% off**  
  - Digital Suite (3+ services) → **20% off**  

### Contact Details
- 📩 **Email:** info@editedgemultimedia.com  
- 📞 **Phone:** +639773938580  
- 🌐 **Website:** [Contact Us](https://www.editedgemultimedia.com/contact)  

### Company Tagline
💡 *"Bringing Brands to Life, One Pixel at a Time."*
`;




  router.post("/chatbot", async (req, res) => {
    try {
        const userMessage = req.body.message.trim().toLowerCase();
        if (!userMessage) {
            return res.json({ reply: "Please enter a message!" });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                { 
                    role: "system", 
                    content: `You are an AI assistant for EditEdge Multimedia.
                    You MUST answer using ONLY the provided company details.
                    If you don’t have an answer, respond warmly and professionally with:
                    "That's a great question! To ensure you get the best information, please visit our contact page here: [Contact Us](/#contact). We're happy to help!"
                    Keep responses short, friendly, and professional.
        
                    Here is everything you need to know:
                    ${BUSINESS_INFO}`
                },
                { role: "user", content: userMessage }
            ],
            max_tokens: 100, // Shortened response
        });
        

        res.json({ reply: response.choices[0].message.content });

    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
});

  
router.get("/chatbot", (req, res) => {
    res.render("chatbot/chatbot", { currentRoute: "/chatbot" });
  });
  



module.exports = router;