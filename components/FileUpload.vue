<template>
  <div class="w-full">
    <div
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-200"
      :class="{ 'border-blue-500 bg-blue-50/50': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <div class="space-y-4">
        <div class="flex flex-col items-center justify-center">
          <Icon name="lucide:upload" class="w-12 h-12 text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900">Upload Files</h3>
          <p class="text-sm text-gray-500 mt-1">
            Drag and drop files here, or click to select files
          </p>
        </div>

        <div class="flex items-center justify-center">
          <Button
            type="button"
            variant="outline"
            class="rounded-full"
            @click="$refs.fileInput.click()"
            :disabled="uploading"
          >
            <Icon
              v-if="uploading"
              name="lucide:loader-2"
              class="w-4 h-4 mr-2 animate-spin"
            />
            <Icon v-else name="lucide:plus" class="w-4 h-4 mr-2" />
            Select Files
          </Button>
        </div>

        <p class="text-xs text-gray-500">
          Supported formats: PDF, PNG, JPG (Max size: 5MB)
        </p>
      </div>

      <input
        ref="fileInput"
        type="file"
        class="hidden"
        multiple
        accept=".pdf,.png,.jpg,.jpeg"
        @change="handleFileSelect"
        :disabled="uploading"
      />
    </div>

    <!-- Upload Progress -->
    <div v-if="uploading" class="mt-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700">Uploading...</span>
        <span class="text-sm text-gray-500">{{ uploadProgress }}%</span>
      </div>
      <Progress :value="uploadProgress" class="h-2" />
    </div>

    <!-- Error Message -->
    <div
      v-if="error"
      class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
    >
      <div class="flex items-center">
        <Icon name="lucide:alert-circle" class="w-5 h-5 text-red-500 mr-2" />
        <p class="text-sm text-red-700">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  onUpload: {
    type: Function,
    required: true,
  },
});

const fileInput = ref(null);
const uploading = ref(false);
const uploadProgress = ref(0);
const error = ref(null);
const isDragging = ref(false);

const handleFileSelect = async (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    await uploadFiles(files);
  }
};

const handleDrop = async (event) => {
  isDragging.value = false;
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    await uploadFiles(files);
  }
};

const uploadFiles = async (files) => {
  try {
    uploading.value = true;
    error.value = null;
    uploadProgress.value = 0;

    // Validate files
    for (const file of files) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`File ${file.name} exceeds 5MB size limit`);
      }

      // Check file type
      const fileExt = file.name.split(".").pop().toLowerCase();
      if (!["pdf", "png", "jpg", "jpeg"].includes(fileExt)) {
        throw new Error(`File ${file.name} has unsupported format`);
      }
    }

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10;
      }
    }, 200);

    // Call the parent component's upload handler
    await props.onUpload(files);

    // Complete the progress
    clearInterval(progressInterval);
    uploadProgress.value = 100;

    // Reset after successful upload
    setTimeout(() => {
      uploading.value = false;
      uploadProgress.value = 0;
      if (fileInput.value) {
        fileInput.value.value = "";
      }
    }, 1000);
  } catch (err) {
    error.value = err.message;
    uploading.value = false;
    uploadProgress.value = 0;
  }
};
</script>
