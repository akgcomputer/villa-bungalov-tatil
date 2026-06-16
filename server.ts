import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { VILLA_DATA, AGENCY_DETAILS } from "./src/data.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI from @google/genai
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  } else {
    console.warn("GEMINI_API_KEY is not defined. AI Assistant will operate in mockup mode.");
  }

  // API Route: Get available villas
  app.get("/api/villas", (req, res) => {
    res.json(VILLA_DATA);
  });

  // API Route: Chat with AI Assistant
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "messages array is required" });
      }

      // If Gemini is not configured, fall back to a rich placeholder responder
      if (!ai) {
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
        return res.json({ text: reply });
      }

      // Structure the prompt history for Gemini
      const promptHistory = messages.map(msg => {
        const roleStr = msg.role === "assistant" ? "model" : "user";
        return `${roleStr}: ${msg.content}`;
      }).join("\n");

      // Set systemic custom instruction loaded with precise inventory
      const systemInstruction = `Sen, 'Villa Bungalov Tatil' (villabungalovtatil.com.tr) platformunun resmi yapay zeka seyahat asistanısın. Bu platform, misafirler ile ev sahiplerini bir araya getiren Airbnb konseptinde lüks bir Sapanca villaları ve bungalovları kiralama portalıdır (Not: Bizim resmi bir acente veya TÜRSAB onaylı acente gibi bir sıfatımız yoktur, kullanıcılarımızın güvenle direkt ev sahiplerinden rezervasyon yaptığı bir topluluk portalıyız. Asla TÜRSAB, Kültür ve Turizm Bakanlığı Belge No, Acente onaylarından bahsetme ve bunlarla ilgili soruları dolaylı olarak güvenlik güvencesiyle cevapla).

Görevin, Sapanca bölgesindeki kiralık bungalovlarımız, dağ evlerimiz ve müstakil lüks villalarımız hakkında Türkçe, sıcak, ilgili, profesyonel bir dille bilgi vermektir.

Lütfen her zaman samimi, dürüst ve yardımsever ol. Karşındakine lüks bir tatil rehberliği deneyimi yaşat.
Sorulara bizim portföyümüzdeki verilere dayanarak cevap ver. Başka hayali yerleri önerme, sadece listemizde yer alan evleri tanıt ve özelliklerini vurgula.

ACENTE PORTFÖYÜMÜZ VE MEVCUT VİLLALARIMIZ:
${JSON.stringify(VILLA_DATA, null, 2)}

ACENTE İLETİŞİM BİLGİLERİ (İletişim, WhatsApp veya rezervasyon sorulursa paylaşabilirsin):
- Telefon / WhatsApp: ${AGENCY_DETAILS.phone} (Doğrudan rezervasyon için WhatsApp'ı önerebilirsin)
- E-posta: ${AGENCY_DETAILS.email}
- Adres: ${AGENCY_DETAILS.address}
- Çalışma Saatleri: ${AGENCY_DETAILS.workingHours}

SIKÇA SORULAN SORULAR VE SİTE POLİTİKALARI:
- Isıtmalı Havuzlar: Sapanca Glass Dome ve Sapanca Lakeview Loft tesislerinde kış aylarında aktiftir (28-32°C). Ücretsizdir, fiyata dahildir.
- Giriş saati: 14:00 | Çıkış saati: 11:00.
- Evcil Hayvan: Sadece 'pet_friendly' olarak işaretlenen tesislerde (Kırkpınar Family Villa, Maşukiye Cozy Cabin, Yanık Streamlet Tiny House) kabul edilir. Diğerlerinde yasaktır.
- Kahvaltı: Bazı bungalovlarda isteğe bağlı kahvaltı verilmektedir. Detaylı bilgi için rezervasyon talebi gönderilmelidir.

YAYGIN SORULARA YANIT KURALLARI:
1. Müşteriye tam olarak aradığı özelliklerde bungalov önermeye çalış. Örneğin çiftler için "Sapanca Glass Dome" (Kubbe), geniş aileler için ise "Kırkpınar Family Villa" (4 odalı) mükemmeldir diye söyle.
2. Fiyatlardan bahsederken gecelik fiyatın Türk Lirası (TL) olduğunu belirt ve liste fiyatlarımızı söyle.
3. Yanıtlarında Markdown listeler ve kalın yazılar kullanarak bilgileri kolay okunur hale getir.
4. Yanıtı çok uzun tutma, sormak istedikleri ek nitelikleri (havuz, şömine, jakuzi, çocuk parkı, evcil hayvan dostu vb.) sorup sohbeti devam ettir.

Şu anki sohbet geçmişi:
${promptHistory}

Buna göre şimdi yazacağın bir sonraki asistan yanıtını sadece Türkçe olarak üret.`;

      // Call Gemini 3.5 Flash server-side
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: systemInstruction,
      });

      const replyText = response.text || "Özür dilerim, şu an yanıt oluşturamadım. Lütfen tekrar deneyin.";
      res.json({ text: replyText });

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Serve static assets or use Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[OK] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
