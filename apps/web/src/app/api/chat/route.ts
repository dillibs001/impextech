import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { CATALOG_PRODUCTS } from '@/lib/catalog';

// Helper knowledge engine when GEMINI_API_KEY is not configured
function getFallbackAdvisorReply(userQuery: string): string {
    const q = userQuery.toLowerCase();

    if (q.includes('battery') || q.includes('health')) {
        return "All impextech gadgets undergo rigorous hardware diagnostic testing. We guarantee a minimum of 85% battery health on every pre-owned device, with most flagship units (like our iPhone 15 Pro Max and Apple Watch Ultra) clocking between 95% and 100%. Each unit's exact battery percentage is recorded before shipping.";
    }

    if (q.includes('guarantee') || q.includes('warranty') || q.includes('return')) {
        return "Every gadget from impextech is covered by our 7-Day Money-Back Guarantee. Take your device home, test it thoroughly under real-world usage, and if any hardware defect arises, we offer an immediate unit replacement or 100% refund.";
    }

    if (q.includes('imei') || q.includes('network') || q.includes('carrier') || q.includes('unlocked')) {
        return "100% of our phones and cellular devices are factory unlocked and verified against global GSMA blacklists. They work out of the box with MTN, Airtel, Glo, and 9mobile in Nigeria.";
    }

    if (q.includes('delivery') || q.includes('shipping') || q.includes('lagos') || q.includes('enugu') || q.includes('abuja')) {
        return "We offer nationwide insured shipping across Nigeria: Lagos deliveries arrive within 24–48 hours, while other states (Abuja, Port Harcourt, Enugu campuses like UNEC and UNN) take 2–4 business days with end-to-end tracking.";
    }

    if (q.includes('whatsapp') || q.includes('contact') || q.includes('call') || q.includes('number')) {
        return "You can reach our direct sales & support concierge on WhatsApp at +234 906 032 9221. We can also provide a live unboxing and battery test video before dispatch!";
    }

    if (q.includes('iphone') || q.includes('phone') || q.includes('samsung') || q.includes('pixel')) {
        const phones = CATALOG_PRODUCTS.filter(p => p.category === 'Phones')
            .map(p => `• ${p.name}: ₦${p.priceNgn.toLocaleString()} (${p.batteryHealth}% Batt)`).join('\n');
        return `Here are the Canada-imported phones currently in stock:\n\n${phones}\n\nAll units are Grade A+ or Excellent condition with clean IMEIs. Would you like to order any of these via WhatsApp or on our website?`;
    }

    if (q.includes('macbook') || q.includes('laptop') || q.includes('xps') || q.includes('computer')) {
        const laptops = CATALOG_PRODUCTS.filter(p => p.category === 'Laptops')
            .map(p => `• ${p.name}: ₦${p.priceNgn.toLocaleString()} (${p.batteryHealth}% Batt)`).join('\n');
        return `Here are our verified laptops in stock from Canada:\n\n${laptops}\n\nEvery laptop includes original charger and has undergone keyboard, display, and thermal stress tests.`;
    }

    if (q.includes('headphone') || q.includes('airpod') || q.includes('audio') || q.includes('sony')) {
        const audio = CATALOG_PRODUCTS.filter(p => p.category === 'Headphones')
            .map(p => `• ${p.name}: ₦${p.priceNgn.toLocaleString()}`).join('\n');
        return `Here are our premium audio devices currently in stock:\n\n${audio}\n\nAll ear cushions and housings are professionally sanitized and sound tested.`;
    }

    if (q.includes('watch') || q.includes('smartwatch')) {
        const watches = CATALOG_PRODUCTS.filter(p => p.category === 'Smartwatches')
            .map(p => `• ${p.name}: ₦${p.priceNgn.toLocaleString()}`).join('\n');
        return `Here are our certified smartwatches in stock:\n\n${watches}\n\nAll include magnetic charging cables and tested battery health.`;
    }

    if (q.includes('camera') || q.includes('canon') || q.includes('lens')) {
        const cameras = CATALOG_PRODUCTS.filter(p => p.category === 'Cameras')
            .map(p => `• ${p.name}: ₦${p.priceNgn.toLocaleString()}`).join('\n');
        return `Here are our mirrorless cameras in stock:\n\n${cameras}\n\nAll cameras feature clean sensors with verified low shutter counts.`;
    }

    // Default friendly assistant response
    return "Hi! I'm your impextech gadget advisor. We specialize in Canada-imported, verified phones (iPhones & Galaxy), MacBooks, audio gear, smartwatches, and cameras — all backed by a 7-day money-back guarantee and verified battery health. What gadget or price range are you looking for today?";
}

export async function POST(req: Request) {
    try {
        const { messages } = await req.json() as { messages: Array<{ role: string; content: string }> };
        if (!messages || messages.length === 0) {
            return NextResponse.json({ reply: "How can I assist you with your gadget purchase today?" });
        }

        const latestMessage = messages[messages.length - 1].content;
        const apiKey = process.env.GEMINI_API_KEY;

        // If Gemini API key is configured, use Gemini GenAI
        if (apiKey && apiKey.trim() !== '') {
            try {
                const ai = new GoogleGenAI({ apiKey });
                const systemInstruction = `
                You are the impextech AI Sales Advisor. impextech sells Canada-imported, certified used & open-box gadgets in Nigeria.
                Core policies:
                - 7-Day Money-Back Guarantee
                - Documented battery health (minimum 85%, many 95-100%)
                - 100% clean global IMEI & factory unlocked for MTN, Airtel, Glo, 9mobile
                - Direct Canada sourcing (never locally repaired)
                - WhatsApp Concierge: +234 906 032 9221
                Be helpful, concise, realistic with Nigerian pricing in Naira (₦), and guide customers toward our catalog or WhatsApp.
                `;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: latestMessage,
                    config: { systemInstruction }
                });

                if (response.text) {
                    return NextResponse.json({ reply: response.text });
                }
            } catch (geminiError) {
                console.warn('Gemini API call failed, falling back to local advisor:', geminiError);
            }
        }

        // Fast, reliable local knowledge engine fallback
        const reply = getFallbackAdvisorReply(latestMessage);
        return NextResponse.json({ reply });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ 
            reply: "I'm here to help you find the right Canada-imported gadget. Feel free to ask about our iPhones, MacBooks, battery health policies, or reach our WhatsApp line at +234 906 032 9221!" 
        });
    }
}
