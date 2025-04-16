import { Mistral } from "@mistralai/mistralai";

export default async function handler(req, res) {
  try {
    const { imageUrl } = req.body;
    const apiKey = process.env.MISTRAL_API_KEY;

    if (!apiKey) {
      throw new Error("MISTRAL_API_KEY is not configured");
    }

    const client = new Mistral({ apiKey });

    const ocrResponse = await client.ocr.process({
      model: "mistral-ocr-latest",
      document: {
        type: "image_url",
        imageUrl,
      },
    });

    return {
      success: true,
      data: ocrResponse,
    };
  } catch (error) {
    console.error("OCR processing error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
