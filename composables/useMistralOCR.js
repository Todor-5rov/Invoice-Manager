import { Mistral } from "@mistralai/mistralai";

// Helper function to add delay between requests
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to convert base64 to file
const base64ToFile = (base64, filename) => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
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
  const supabase = useSupabaseClient();
  const user = useState("user");

  try {
    if (fileType === "image") {
      // For images, upload to Supabase first
      console.log("Processing image file");

      // Create a unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.value.id}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExt}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("invoices")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error("Failed to upload image to storage");
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("invoices").getPublicUrl(fileName);

      console.log(
        "Image uploaded to Supabase, processing OCR with URL:",
        publicUrl
      );

      // Add delay before OCR request
      await delay(1500);

      // Process OCR with the image URL
      const ocrResponse = await client.ocr.process({
        model: "mistral-ocr-latest",
        document: {
          type: "image_url",
          imageUrl: publicUrl,
        },
        includeImageBase64: true,
      });

      console.log("Full OCR Response:", JSON.stringify(ocrResponse, null, 2));

      // Check if the response is just an image reference
      if (
        ocrResponse.pages[0].markdown.startsWith("![") &&
        ocrResponse.pages[0].images?.length > 0
      ) {
        console.log(
          "OCR detected image content, processing extracted images..."
        );

        let extractedText = null;

        // Process each detected image
        for (const image of ocrResponse.pages[0].images) {
          console.log("Processing detected image:", image.id);

          // Convert base64 to file
          const imageFile = base64ToFile(image.imageBase64, image.id);

          // Create new filename for the extracted image
          const extractedFileName = `${
            user.value.id
          }/${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${
            image.id
          }`;

          // Upload extracted image to Supabase
          const { error: extractedUploadError } = await supabase.storage
            .from("invoices")
            .upload(extractedFileName, imageFile);

          if (extractedUploadError) {
            console.error(
              "Error uploading extracted image:",
              extractedUploadError
            );
            continue;
          }

          // Get public URL for extracted image
          const {
            data: { publicUrl: extractedImageUrl },
          } = supabase.storage.from("invoices").getPublicUrl(extractedFileName);

          // Add delay before OCR request
          await delay(1500);

          // Process OCR on extracted image
          const extractedOcrResponse = await client.ocr.process({
            model: "mistral-ocr-latest",
            document: {
              type: "image_url",
              imageUrl: extractedImageUrl,
            },
            includeImageBase64: true,
          });

          console.log(
            "Extracted image OCR response:",
            JSON.stringify(extractedOcrResponse, null, 2)
          );

          // If we get actual text from the extracted image, store it
          if (!extractedOcrResponse.pages[0].markdown.startsWith("![")) {
            console.log("Found text in extracted image");
            extractedText = extractedOcrResponse.pages[0].markdown;
            break; // Stop processing if we found text
          }
        }

        if (extractedText) {
          console.log(
            "OCR processing completed successfully with extracted text"
          );
          return extractedText;
        } else {
          // If we get here, all extracted images were also images
          throw new Error(
            "The document appears to be a scanned image or contains only images. Please ensure the document is clear and contains readable text."
          );
        }
      }

      console.log("OCR processing completed successfully");
      return ocrResponse.pages[0].markdown;
    } else if (fileType === "pdf") {
      // For PDFs, use the direct upload method
      console.log("Processing PDF file");

      // Add delay before file upload
      await delay(1500);

      // Upload the file to Mistral
      const uploadedFile = await client.files.upload({
        file: {
          fileName: file.name,
          content: file,
        },
        purpose: "ocr",
      });
      console.log("PDF uploaded successfully. File ID:", uploadedFile.id);

      // Add delay before getting signed URL
      await delay(1500);

      // Get signed URL from Mistral
      const signedUrl = await client.files.getSignedUrl({
        fileId: uploadedFile.id,
      });
      console.log("Received signed URL from Mistral:", signedUrl.url);

      // Add delay before OCR request
      await delay(1500);

      // Process OCR with the signed URL
      const ocrResponse = await client.ocr.process({
        model: "mistral-ocr-latest",
        document: {
          type: "document_url",
          documentUrl: signedUrl.url,
        },
        includeImageBase64: true,
      });

      console.log("Full OCR Response:", JSON.stringify(ocrResponse, null, 2));

      // Check if the response is just an image reference
      if (
        ocrResponse.pages[0].markdown.startsWith("![") &&
        ocrResponse.pages[0].images?.length > 0
      ) {
        console.log(
          "OCR detected image content, processing extracted images..."
        );

        let extractedText = null;

        // Process each detected image
        for (const image of ocrResponse.pages[0].images) {
          console.log("Processing detected image:", image.id);

          // Convert base64 to file
          const imageFile = base64ToFile(image.imageBase64, image.id);

          // Create new filename for the extracted image
          const extractedFileName = `${
            user.value.id
          }/${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${
            image.id
          }`;

          // Upload extracted image to Supabase
          const { error: extractedUploadError } = await supabase.storage
            .from("invoices")
            .upload(extractedFileName, imageFile);

          if (extractedUploadError) {
            console.error(
              "Error uploading extracted image:",
              extractedUploadError
            );
            continue;
          }

          // Get public URL for extracted image
          const {
            data: { publicUrl: extractedImageUrl },
          } = supabase.storage.from("invoices").getPublicUrl(extractedFileName);

          // Add delay before OCR request
          await delay(1500);

          // Process OCR on extracted image
          const extractedOcrResponse = await client.ocr.process({
            model: "mistral-ocr-latest",
            document: {
              type: "image_url",
              imageUrl: extractedImageUrl,
            },
            includeImageBase64: true,
          });

          console.log(
            "Extracted image OCR response:",
            JSON.stringify(extractedOcrResponse, null, 2)
          );

          // If we get actual text from the extracted image, store it
          if (!extractedOcrResponse.pages[0].markdown.startsWith("![")) {
            console.log("Found text in extracted image");
            extractedText = extractedOcrResponse.pages[0].markdown;
            break; // Stop processing if we found text
          }
        }

        if (extractedText) {
          console.log(
            "OCR processing completed successfully with extracted text"
          );
          return extractedText;
        } else {
          // If we get here, all extracted images were also images
          throw new Error(
            "The document appears to be a scanned image or contains only images. Please ensure the document is clear and contains readable text."
          );
        }
      }

      console.log("OCR processing completed successfully");
      return ocrResponse.pages[0].markdown;
    } else {
      throw new Error("Unsupported file type. Please use PDF or image files.");
    }
  } catch (error) {
    console.error("OCR processing error:", error);
    throw error;
  }
};
