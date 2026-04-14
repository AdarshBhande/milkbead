import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === "your_groq_api_key_here") {
      return NextResponse.json({ error: "Groq API key not configured in .env.local" }, { status: 500 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType || "image/jpeg"};base64,${imageBase64}`,
                },
              },
              {
                type: "text",
                text: `You are a professional product copywriter for "Milkbead" — a premium handmade jewelry and accessories brand in India that sells aesthetic, trendy, and feminine pieces.

Analyze this product image and respond with ONLY a valid JSON object (no markdown, no code blocks, no extra text):
{
  "name": "short, catchy product name (max 6 words). Use evocative, aesthetic words like: Pearl, Bloom, Velvet, Crystal, Charm, Dainty, Luster, Glow, Dreamy, Celestial, Soft, Blush, Petal, Silk, Vintage, Dewy, Ethereal, Radiant — Never use 'kawaii'",
  "description": "2-3 sentences that make the customer fall in love with the product. Focus on how it makes them feel, the quality of materials, and who it is perfect for. Use words like: effortless, statement, delicate, elegant, curated, minimal, wearable art, handcrafted, everyday glam. Never use 'kawaii'.",
  "category": "one of exactly: Necklaces, Bracelets, Earrings, Keychains, Bows, Rings, Phone Charms",
  "badge": "one of exactly: NEW, BESTSELLER, SALE, or empty string"
}`,
              },
            ],
          },
        ],
        max_tokens: 400,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq API error:", err);
      return NextResponse.json(
        { error: "Groq API request failed: " + err },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "No response from Groq" }, { status: 500 });
    }

    // Parse JSON — strip any accidental markdown code fences
    const cleaned = content.replace(/```json|```/g, "").trim();
    try {
      const parsed = JSON.parse(cleaned);
      return NextResponse.json({ success: true, suggestion: parsed });
    } catch {
      // Try to extract JSON object from any extra text
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ success: true, suggestion: parsed });
      }
      return NextResponse.json(
        { error: "Could not parse AI response", raw: content },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Analyze image error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
