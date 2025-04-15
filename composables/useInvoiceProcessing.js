import { Mistral } from "@mistralai/mistralai";

export const useInvoiceProcessing = () => {
  const supabase = useSupabaseClient();
  const user = useState("user");
  const config = useRuntimeConfig();
  const client = new Mistral({ apiKey: config.public.mistralApiKey });
  const { extractInvoiceData } = useMistralAI();

  const processUploadedInvoice = async (file) => {
    try {
      console.log("Starting invoice upload process for:", file.name);
      console.log("Original file details:", {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
      });

      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.value.id}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("invoices")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error("Failed to upload file");
      }

      console.log("File uploaded successfully:", uploadData);

      // 2. Get public URL for the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from("invoices").getPublicUrl(fileName);

      // 3. Extract text from the file using Mistral OCR
      console.log("Extracting text from file...");
      const ocrText = await useMistralOCR({ file, fileType: file.type });
      console.log("Extracted text:", ocrText);

      // 4. Extract structured data using Mistral AI
      console.log("Extracting structured data from text...");
      const extractedData = await extractInvoiceData(ocrText);
      console.log("Extracted data:", extractedData);

      // Remove currency field as it's not in our database schema
      const { currency, ...dataToSave } = extractedData;

      // 5. Save invoice data to database with all required fields
      const invoiceData = {
        user_id: user.value.id,
        file_path: fileName,
        file_name: file.name,
        file_size: file.size,
        upload_date: new Date().toISOString(),
        ...dataToSave,
      };

      console.log("Attempting to save invoice data:", invoiceData);

      const { error: dbError } = await supabase
        .from("invoices")
        .insert(invoiceData);

      if (dbError) {
        console.error("Database error:", dbError);
        throw new Error(`Failed to save invoice data: ${dbError.message}`);
      }

      return {
        success: true,
        data: {
          publicUrl,
          ...extractedData,
        },
      };
    } catch (error) {
      console.error("Invoice processing error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  };

  return {
    processUploadedInvoice,
  };
};
