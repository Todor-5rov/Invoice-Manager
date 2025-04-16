<template>
  <div
    class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
    @click="triggerFileInput"
    @drop.prevent="handleDrop"
    @dragover.prevent
  >
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      accept=".pdf,.jpg,.jpeg,.png"
      @change="handleFileSelect"
      multiple
    />
    <Icon name="lucide:upload" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
    <p class="text-gray-600">
      Drag and drop your file here, or click to browse
    </p>
    <p class="text-xs text-gray-500">
      Supported formats: PDF, PNG, JPG (Max size: 5MB)
    </p>
    <p class="text-xs text-yellow-600 mt-2">
      <Icon name="lucide:alert-triangle" class="w-4 h-4 inline mr-1" />
      Note: AI extraction may not be 100% accurate. Please review and edit the
      extracted information after upload.
    </p>
  </div>
</template>

<script setup>
const fileInput = ref(null);
const emit = defineEmits(["upload"]);
const user = useState("user");

const triggerFileInput = () => {
  if (!user.value) {
    console.log("User not authenticated, redirecting to login");
    toast({
      title: "Authentication Required",
      description: "Please log in to upload files",
      variant: "destructive",
    });
    navigateTo("/login");
    return;
  }
  fileInput.value.click();
};

const handleFileSelect = (event) => {
  if (!user.value) {
    console.log("User not authenticated, redirecting to login");
    toast({
      title: "Authentication Required",
      description: "Please log in to upload files",
      variant: "destructive",
    });
    navigateTo("/login");
    return;
  }
  emit("upload", Array.from(event.target.files));
};

const handleDrop = (event) => {
  if (!user.value) {
    console.log("User not authenticated, redirecting to login");
    toast({
      title: "Authentication Required",
      description: "Please log in to upload files",
      variant: "destructive",
    });
    navigateTo("/login");
    return;
  }
  emit("upload", Array.from(event.dataTransfer.files));
};
</script>
