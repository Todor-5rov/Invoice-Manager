<template>
  <div class="space-y-4">
    <div class="flex flex-col space-y-2">
      <label class="text-sm font-medium">Select File Type</label>
      <select v-model="fileType" class="p-2 border rounded">
        <option value="image">Image</option>
        <option value="pdf">PDF</option>
      </select>
    </div>

    <div class="flex flex-col space-y-2">
      <label class="text-sm font-medium">Upload File</label>
      <input
        type="file"
        @change="handleFileUpload"
        :accept="fileType === 'image' ? 'image/*' : '.pdf'"
        class="p-2 border rounded"
      />
    </div>

    <button
      @click="processOCR"
      :disabled="!selectedFile || isProcessing"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {{ isProcessing ? "Processing..." : "Process OCR" }}
    </button>

    <div v-if="error" class="p-4 bg-red-100 text-red-700 rounded">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
const fileType = ref("image");
const selectedFile = ref(null);
const isProcessing = ref(false);
const error = ref(null);

const handleFileUpload = (event) => {
  console.log("File selected:", event.target.files[0]);
  selectedFile.value = event.target.files[0];
  error.value = null;
};

const processOCR = async () => {
  if (!selectedFile.value) {
    console.warn("No file selected");
    return;
  }

  console.log("Starting OCR process for file:", {
    name: selectedFile.value.name,
    type: selectedFile.value.type,
    size: selectedFile.value.size,
  });

  isProcessing.value = true;
  error.value = null;

  try {
    // Create a temporary file path
    const filePath = URL.createObjectURL(selectedFile.value);
    console.log("Created temporary file URL:", filePath);

    // Process the file using OCR
    console.log("Calling Mistral OCR with:", {
      filePath,
      fileType: fileType.value,
    });
    const ocrResult = await useMistralOCR({
      filePath,
      fileType: fileType.value,
    });

    console.log("OCR Result:", ocrResult);

    // Log specific parts of the result that might be useful
    if (ocrResult.text) {
      console.log("Extracted Text:", ocrResult.text);
    }
    if (ocrResult.blocks) {
      console.log("Number of text blocks:", ocrResult.blocks.length);
    }
    if (ocrResult.pages) {
      console.log("Number of pages:", ocrResult.pages.length);
    }
  } catch (err) {
    console.error("OCR Processing Error:", err);
    error.value = err.message;
  } finally {
    isProcessing.value = false;
    console.log("OCR process completed");
  }
};
</script>
