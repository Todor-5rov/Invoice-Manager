import { Mistral } from "@mistralai/mistralai";

// Helper function to encode image to base64
const encodeImageToBase64 = async (file) => {
  console.log("Encoding image to base64:", file.name);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result.split(",")[1];
      console.log("Image encoded successfully");
      resolve(`data:${file.type};base64,${base64Data}`);
    };
    reader.onerror = (error) => {
      console.error("Error encoding image:", error);
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

// Main OCR function
export const useMistralOCR = async ({ file, fileType }) => {
  console.log("Starting OCR process for:", { fileName: file.name, fileType });
  console.log("File details:", {
    name: file.name,
    type: file.type,
    size: file.size,
    lastModified: file.lastModified,
  });

  const config = useRuntimeConfig();
  const apiKey = config.public.mistralApiKey;
  if (!apiKey) {
    console.error("Mistral API key is not set in Nuxt config");
    throw new Error("Mistral API key is not set in Nuxt config");
  }

  console.log("Initializing Mistral client");
  const client = new Mistral({ apiKey });

  // First upload the file to Mistral
  console.log("Uploading file to Mistral");
  console.log("File content type:", file.type);
  console.log("File content:", file);

  const uploadedFile = await client.files.upload({
    file: {
      fileName: file.name,
      content: file,
    },
    purpose: "ocr",
  });
  console.log("File uploaded successfully. File ID:", uploadedFile.id);

  // Get signed URL from Mistral
  const signedUrl = await client.files.getSignedUrl({
    fileId: uploadedFile.id,
  });
  console.log("Received signed URL from Mistral:", signedUrl.url);

  // Process OCR with the signed URL
  console.log("Sending document to Mistral OCR");
  const ocrResponse = await client.ocr.process({
    model: "mistral-ocr-latest",
    document: {
      type: "document_url",
      documentUrl: signedUrl.url,
    },
    includeImageBase64: true,
  });
  console.log("OCR processing completed successfully");
  console.log("Full OCR Response:", JSON.stringify(ocrResponse, null, 2));
  console.log("OCR Text Content:", ocrResponse.pages[0].markdown);
  console.log("Number of Pages:", ocrResponse.pages?.length);
  if (ocrResponse.pages) {
    console.log(
      "Page Details:",
      ocrResponse.pages.map((page) => ({
        index: page.index,
        text: page.markdown,
        dimensions: page.dimensions,
      }))
    );
  }

  return ocrResponse.pages[0].markdown;
};
