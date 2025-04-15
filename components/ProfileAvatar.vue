<script setup>
const props = defineProps({
  path: String,
  size: {
    type: String,
    default: "10em",
  },
});
const { path } = toRefs(props);

const emit = defineEmits(["update:path", "upload"]);

const supabase = useSupabaseClient();

const uploading = ref(false);
const src = ref("");
const files = ref();

const downloadImage = async () => {
  try {
    if (!path.value) return;

    // If path is already a URL, use it directly
    if (path.value.startsWith("http")) {
      src.value = path.value;
      return;
    }

    // Otherwise, download from storage
    const { data, error } = await supabase.storage
      .from("files")
      .download(path.value);
    if (error) throw error;
    src.value = URL.createObjectURL(data);
  } catch (error) {
    console.error("Error downloading image: ", error.message);
    // Don't show toast here as it's not user-initiated
  }
};

const uploadAvatar = async (evt) => {
  files.value = evt.target.files;
  try {
    uploading.value = true;

    if (!files.value || files.value.length === 0) {
      throw new Error("You must select an image to upload.");
    }

    const file = files.value[0];
    const fileExt = file.name.split(".").pop();

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("File size must be less than 2MB");
    }

    // Only allow image files
    if (
      !["jpg", "jpeg", "png", "webp", "gif"].includes(fileExt.toLowerCase())
    ) {
      throw new Error("Only image files are allowed");
    }

    // Create a unique filename
    const fileName = `${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("files")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    emit("update:path", filePath);
    emit("upload");

    toast({
      title: "Success",
      description: "Image uploaded successfully",
      variant: "success",
    });
  } catch (error) {
    console.error("Upload error:", error);
    toast({
      title: "Upload Failed",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    uploading.value = false;
  }
};

// Download image on mount
onMounted(() => {
  if (path.value) {
    downloadImage();
  }
});

watch(path, () => {
  if (path.value) {
    downloadImage();
  }
});
</script>

<template>
  <div class="flex flex-col items-center">
    <!-- Display image if available -->
    <div class="relative">
      <div v-if="src" class="avatar-container">
        <img
          :src="src"
          alt="Avatar"
          class="rounded-full object-cover"
          :style="{ height: size, width: size }"
        />
      </div>
      <!-- Placeholder if no image -->
      <div
        v-else
        class="bg-blue-100 rounded-full flex items-center justify-center"
        :style="{ height: size, width: size }"
      >
        <Icon name="lucide:user" class="text-blue-600 w-1/2 h-1/2" />
      </div>

      <!-- Upload button -->
      <div class="absolute bottom-0 right-0">
        <Button
          size="icon"
          variant="outline"
          class="bg-white rounded-full border-blue-200"
          :disabled="uploading"
          @click="$refs.fileInput.click()"
        >
          <Icon
            v-if="uploading"
            name="lucide:loader-2"
            class="w-4 h-4 animate-spin"
          />
          <Icon v-else name="lucide:camera" class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <!-- Hidden file input -->
    <input
      ref="fileInput"
      class="hidden"
      type="file"
      id="avatar-upload"
      accept="image/*"
      @change="uploadAvatar"
      :disabled="uploading"
    />
  </div>
</template>

<style scoped>
.avatar-container {
  overflow: hidden;
}
</style>
