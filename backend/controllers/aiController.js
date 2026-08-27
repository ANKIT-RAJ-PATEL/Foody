import dotenv from "dotenv";
dotenv.config();

// system prompts for each role
const SYSTEM_PROMPTS = {
  user: `You are "Foody AI" — a friendly food delivery assistant for the Foody platform.

Your core responsibilities:
1. FIRST, greet the user warmly and ask about their current mood.
2. Based on their mood, recommend food items from the "Available Items" list provided in context.
   Mood-to-food mapping:
   - Happy / Excited → celebratory foods like Biryani, Pizza, Paneer Tikka, Butter Chicken, Fried Rice
   - Sad / Stressed → comfort foods like Maggi, Chai, Dal Rice, Khichdi, Rasgulla, Ice Cream
   - Tired → light foods like Salad, Soup, Fruits, Sandwich, Juices
   - Hungry / Heavy craving → full meals like Thali, Biryani, Butter Chicken, Noodles
   - Neutral → suggest top-rated or trending items from available list
3. If user mentions ANY delivery issue (late delivery, wrong order, food quality, rider problem):
   a. FIRST apologize and try to resolve it yourself with helpful suggestions
   b. Say things like "I understand your frustration, let me help" or "We will look into this"
   c. Suggest practical solutions like "Please wait a few more minutes" or "You can track your order"
   d. If the user says the issue is NOT resolved or they want to talk to the shop owner,
      you MUST provide the shop owner's phone number and email from the context
4. Always recommend items that exist in the "Available Items" list — do NOT make up items
5. Keep responses short, crisp, and helpful (2-4 sentences max)
6. Use food emojis where appropriate

Rules:
- Always respond in English
- Be empathetic when user is frustrated
- Always greet the user first
- If no mood is selected, ask "How are you feeling today?"`,

  owner: `You are "Foody AI" — a restaurant management assistant for shop owners on Foody.

Your core responsibilities:
1. Help owners set up their restaurant profile (name, image, location, address)
2. Guide them on adding and editing menu items with proper categories
3. Provide tips on pricing strategy based on food category
4. Help with order management — explain status flow (pending → preparing → out for delivery → delivered)
5. Suggest menu organization tips (group by category, highlight bestsellers)
6. Give restaurant growth tips (food photography, quick response time, maintaining ratings)

Rules:
- Always respond in English
- Be professional, encouraging, and supportive
- Give step-by-step guidance when explaining processes
- Suggest best practices for food delivery platforms
- Keep responses clear and actionable`,

  deliveryboy: `You are "Foody AI" — a delivery partner assistant for Foody delivery riders.

Your core responsibilities:
1. Help with location-related issues (location not detected, GPS problems)
2. Provide navigation and route optimization tips
3. Guide on order pickup process from restaurant
4. Guide on delivery process to customer (OTP verification, mark as delivered)
5. Help troubleshoot common delivery problems
6. Give safety and efficiency tips for faster deliveries

Rules:
- Always respond in English
- Be motivating and supportive — delivery riders work hard
- Give practical, actionable advice
- Emphasize safety and timely delivery
- If rider is lost, suggest using Google Maps or asking locals`
};

// simple rate limiter — 10 req/min per user
const rateLimitMap = new Map();

const checkRateLimit = (userId) => {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 10;

  if (!rateLimitMap.has(userId)) {
    rateLimitMap.set(userId, []);
  }

  const timestamps = rateLimitMap.get(userId);
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);
  rateLimitMap.set(userId, validTimestamps);

  if (validTimestamps.length >= maxRequests) {
    return false;
  }

  validTimestamps.push(now);
  return true;
};

// build context-aware system prompt with user's data
const buildContextPrompt = (basePrompt, context) => {
  if (!context) return basePrompt;

  let ctx = "\n\n--- CURRENT CONTEXT ---\n";

  if (context.userName) {
    ctx += `User's name: ${context.userName}\n`;
  }

  if (context.city) {
    ctx += `User's city: ${context.city}\n`;
  }

  if (context.availableItems && context.availableItems.length > 0) {
    ctx += `\nAvailable food items in ${context.city || "the user's area"}:\n`;
    context.availableItems.forEach((item, index) => {
      ctx += `${index + 1}. ${item.name} — ₹${item.price} (${item.category}, ${item.foodType})\n`;
    });
  } else {
    ctx += "\nNo specific menu items available in context. Suggest general food ideas.\n";
  }

  if (context.shopOwnerPhone || context.shopOwnerEmail) {
    ctx += `\nShop Owner Contact (for escalation):\n`;
    if (context.shopOwnerPhone) ctx += `Phone: ${context.shopOwnerPhone}\n`;
    if (context.shopOwnerEmail) ctx += `Email: ${context.shopOwnerEmail}\n`;
    ctx += "Provide this contact ONLY if the user's issue is not resolved and they specifically ask to contact the owner.\n";
  }

  ctx += "--- END CONTEXT ---\n";

  return basePrompt + ctx;
};

// main chat handler
const chatWithAI = async (req, res) => {
  try {
    const { message, role, provider, context } = req.body;
    const userId = req.userId;

    if (!message || !role) {
      return res.status(400).json({ message: "message and role are required" });
    }

    if (!checkRateLimit(userId)) {
      return res.status(429).json({ message: "Too many requests. Please wait a minute." });
    }

    const basePrompt = SYSTEM_PROMPTS[role] || SYSTEM_PROMPTS.user;
    const systemPrompt = buildContextPrompt(basePrompt, context);

    if (provider === "groq") {
      const groqApiKey = process.env.GROQ_API_KEY;
      if (!groqApiKey) {
        return res.status(500).json({ message: "Groq API key not configured" });
      }

      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: "groq/compound-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!groqResponse.ok) {
        const errData = await groqResponse.text();
        console.log("Groq API error:", errData);
        return res.status(500).json({ message: "Error from Groq API" });
      }

      const groqData = await groqResponse.json();
      const groqReply = groqData.choices?.[0]?.message?.content || "Sorry, I could not understand. Please try again.";
      return res.status(200).json({ reply: groqReply });

    } else {
      // gemini by default
      const geminiApiKey = process.env.GEMINI_API_KEY;
      if (!geminiApiKey) {
        return res.status(500).json({ message: "Gemini API key not configured" });
      }

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            contents: [
              { role: "user", parts: [{ text: message }] }
            ],
            generationConfig: {
              maxOutputTokens: 500,
              temperature: 0.7,
            },
          }),
        }
      );

      if (!geminiResponse.ok) {
        const errData = await geminiResponse.text();
        console.log("Gemini API error:", errData);
        return res.status(500).json({ message: "Error from Gemini API" });
      }

      const geminiData = await geminiResponse.json();
      const geminiReply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I could not understand. Please try again.";
      return res.status(200).json({ reply: geminiReply });
    }

  } catch (error) {
    console.log("AI chat error:", error);
    return res.status(500).json({ message: "AI chat error" });
  }
};

export { chatWithAI };
