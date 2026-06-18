import { GoogleGenAI } from "@google/genai";
import { VILLA_DATA, AGENCY_DETAILS } from "../../src/data.js";

interface Env {
  GEMINI_API_KEY?: string;
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const data = await context.request.json() as any;
    const messages = data?.messages;

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "messages array is required" }, { status: 400 });
    }

    const apiKey = context.env.GEMINI_API_KEY;

    // AI Fallback Mockup Mode if no key
    if (!apiKey) {
      const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
      let reply = "Genel villa ve bungalov kiralama hizmetlerimiz hakkında bilgi almak için bizimle WhatsApp üzerinden de iletişime geçebilirsiniz. Size nasıl yardımcı olabilirim?";
      if (lastMsg.includes("fiyat") || lastMsg.includes("ücret")) {
        reply = "Sapanca tesislerimizin günlük kiralık fiyatları sezona ve hafta sonuna göre farklılık göstermekle birlikte bütçe dostu bungalovlarımız gecelik 4.500 TL'den, lüks müstakil villalarımız ise 12.500 TL'ye kadar çıkmaktadır. Detaylı bilgi veya size en uygun seçeneği belirlemek için istediğiniz tarihleri öğrenebilir miyim?";
      } else if (lastMsg.includes("havuz") || lastMsg.includes("sıcak")) {
        reply = "Tabii ki! Sapanca Glass Dome ve Sapanca Lakeview Loft tesislerimizde kış aylarında da keyifle girebileceğiniz 28-32°C sıcaklığında özel ısıtmalı havuzlar mevcuttur. Havuz ısıtması için ekstra ücret alınmamaktadır.";
      } else if (lastMsg.includes("jakuzi")) {
        reply = "Portföyümüzdeki Sapanca Glass Dome, Maşukiye Cozy Cabin, Sapanca Lakeview Loft ve Yanık Streamlet Tiny House projelerimizde dinlendirici sıcak jakuzi alanları mevcuttur. Tamamı hijyen standartlarına uygun doldur-boşalt sistemlerdir.";
      } else if (lastMsg.includes("rezervasyon") || lastMsg.includes("kirala")) {
        reply = "Sitemiz üzerinden istediğiniz tesis için 'Rezervasyon Talebi Gönder' butonunu kullanarak ya da doğrudan WhatsApp numaramız olan +90 532 123 45 67 üzerinden rezervasyon talebinizi hızla oluşturabilirsiniz!";
      }
      return Response.json({ text: reply });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: { "User-Agent": "aistudio-build" }
      }
    });

    const promptHistory = messages.map(msg => {
      const roleStr = msg.role === "assistant" ? "model" : "user";
      return `${roleStr}: ${msg.content}`;
    }).join("\n");

    const systemInstruction = `Sen, 'Villa Bungalov Tatil' (villabungalovtatil.com.tr) platformunun resmi yapay zeka seyahat asistanısın.
Görevlerin:
- Misafirleri tatillerine uygun lüks villalarımız ve bungalovlarımız hakkında bilgilendir.
- Her zaman Türkçe, samimi ve dürüst ol. Başka hayali yerler önerme.

İletişim Bilgilerimiz:
Telefon / WhatsApp: ${AGENCY_DETAILS.phone}

Geçmiş:
${promptHistory}

Buna göre şimdi yazacağın bir sonraki asistan yanıtını sadece Türkçe olarak üret.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: systemInstruction,
    });

    const replyText = response.text || "Özür dilerim, şu an yanıt oluşturamadım.";
    return Response.json({ text: replyText });

  } catch (error: any) {
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
};
