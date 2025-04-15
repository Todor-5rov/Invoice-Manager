export const useMistralAI = () => {
  const config = useRuntimeConfig();
  const mistralApiKey = config.public.mistralApiKey;
  const mistralApiUrl = "https://api.mistral.ai/v1/chat/completions";
  let lastRequestTime = 0;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const extractInvoiceData = async (
    markdownText,
    retries = 3,
    delay = 1500 // Increased default delay to 1.5 seconds
  ) => {
    try {
      const prompt = `Extract the following information from this invoice markdown text and return it as a raw JSON object. If any field is not found, set it to null. Only return the raw JSON object, no other text.

Required fields:
- document_number (invoice number)
- issue_date (date in YYYY-MM-DD format)
- issuer_name (company or person issuing the invoice)
- issuer_address
- issuer_id (VAT or company registration number)
- recipient_name
- recipient_address
- recipient_id (VAT or company registration number)
- transaction_purpose
- tax_rate (as decimal)
- transaction_amount (as decimal)
- currency

Here is the invoice text:
${markdownText}

Example of expected output:
{
  "document_number": "INV-0000000397",
  "issue_date": "2025-04-13",
  "issuer_name": "Origin BG OOD",
  "issuer_address": "26, Todor Aleksandrov Blvd, 1000 Sofia",
  "issuer_id": "BG111111111",
  "recipient_name": "Sample Client",
  "recipient_address": "Baker Street, Plovdiv, Bulgaria",
  "recipient_id": null,
  "transaction_purpose": "Consultation services",
  "tax_rate": 0.20,
  "transaction_amount": 840.00,
  "currency": "EUR"
}`;

      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          console.log(
            `Attempt ${attempt} of ${retries} to extract invoice data...`
          );

          // Calculate time since last request
          const now = Date.now();
          const timeSinceLastRequest = now - lastRequestTime;
          if (timeSinceLastRequest < delay) {
            const waitTime = delay - timeSinceLastRequest;
            console.log(`Waiting ${waitTime}ms before next request...`);
            await sleep(waitTime);
          }

          const response = await fetch(mistralApiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${mistralApiKey}`,
            },
            body: JSON.stringify({
              model: "mistral-large-latest",
              messages: [
                {
                  role: "user",
                  content: prompt,
                },
              ],
              temperature: 0.1,
              max_tokens: 2000,
            }),
          });

          // Update last request time
          lastRequestTime = Date.now();

          if (response.status === 429) {
            const retryAfter = response.headers.get("Retry-After") || delay;
            console.log(
              `Rate limit hit. Waiting ${retryAfter}ms before retry...`
            );
            await sleep(parseInt(retryAfter) * 1000);
            continue;
          }

          if (!response.ok) {
            throw new Error(`Mistral API error: ${response.statusText}`);
          }

          const data = await response.json();
          console.log("Mistral API response:", data);

          // Extract JSON from the response
          const content = data.choices[0].message.content;
          const jsonMatch =
            content.match(/```json\n([\s\S]*?)\n```/) ||
            content.match(/\{[\s\S]*\}/);
          const cleanedContent = jsonMatch ? jsonMatch[1] : content;

          console.log("Cleaned content:", cleanedContent);

          try {
            const extractedData = JSON.parse(cleanedContent);

            // Validate and clean the data
            return {
              document_number: extractedData.document_number || null,
              issue_date: extractedData.issue_date || null,
              issuer_name: extractedData.issuer_name || null,
              issuer_address: extractedData.issuer_address || null,
              issuer_id: extractedData.issuer_id || null,
              recipient_name: extractedData.recipient_name || null,
              recipient_address: extractedData.recipient_address || null,
              recipient_id: extractedData.recipient_id || null,
              transaction_purpose: extractedData.transaction_purpose || null,
              tax_rate: extractedData.tax_rate
                ? parseFloat(extractedData.tax_rate)
                : null,
              transaction_amount: extractedData.transaction_amount
                ? parseFloat(extractedData.transaction_amount)
                : null,
              currency: extractedData.currency || null,
            };
          } catch (parseError) {
            console.error("JSON parsing error:", parseError);
            console.error("Content that failed to parse:", cleanedContent);
            throw new Error("Failed to parse JSON response from Mistral AI");
          }
        } catch (error) {
          if (attempt === retries) {
            throw error;
          }
          console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
          await sleep(delay);
          delay *= 2; // Exponential backoff
        }
      }
    } catch (error) {
      console.error("Error extracting invoice data:", error);
      throw new Error(`Failed to extract invoice data: ${error.message}`);
    }
  };

  return {
    extractInvoiceData,
  };
};
