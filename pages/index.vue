<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <!-- Main Content -->
    <main class="container mx-auto px-4">
      <div class="relative">
        <div class="absolute inset-0">
          <DotPattern />
        </div>

        <div class="container mx-auto px-4 py-20">
          <div class="relative z-10 text-center max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              class="mb-6 animate-float bg-blue-100/50 text-blue-700 border-blue-200 rounded-full px-4 py-2"
            >
              <Icon name="lucide:file-text" class="w-4 h-4 mr-1" /> Modern
              Invoice Management
            </Badge>

            <h1 class="text-5xl md:text-6xl font-bold mb-6 text-navy-900">
              Invoice
              <span
                class="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text"
                >Management</span
              >
            </h1>

            <p class="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
              Streamline your invoice management with our powerful solution
              featuring secure storage, easy organization, and quick access to
              your important documents.
            </p>

            <!-- File Uploader -->
            <div
              class="max-w-2xl mx-auto bg-white/80 backdrop-blur-lg border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl shadow-[0_8px_32px_rgba(31,38,135,0.07)] p-8"
            >
              <FileUpload :onUpload="handleFileUpload" />
            </div>

            <div class="mt-20 text-center">
              <p class="text-sm text-gray-500 uppercase tracking-wider mb-4">
                Key benefits:
              </p>
              <div class="flex flex-wrap justify-center items-center gap-8">
                <div
                  class="flex items-center justify-center px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 shadow-sm"
                >
                  <Icon
                    name="lucide:clock"
                    class="w-5 h-5 mr-2 text-blue-600"
                  />
                  <span class="font-medium text-gray-800"
                    >Save 5+ Hours Weekly</span
                  >
                </div>
                <div
                  class="flex items-center justify-center px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 shadow-sm"
                >
                  <Icon
                    name="lucide:shield-check"
                    class="w-5 h-5 mr-2 text-blue-600"
                  />
                  <span class="font-medium text-gray-800"
                    >Bank-Level Security</span
                  >
                </div>
                <div
                  class="flex items-center justify-center px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 shadow-sm"
                >
                  <Icon
                    name="lucide:search"
                    class="w-5 h-5 mr-2 text-blue-600"
                  />
                  <span class="font-medium text-gray-800">Instant Search</span>
                </div>
                <div
                  class="flex items-center justify-center px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 shadow-sm"
                >
                  <Icon
                    name="lucide:cloud"
                    class="w-5 h-5 mr-2 text-blue-600"
                  />
                  <span class="font-medium text-gray-800">Cloud Storage</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <div class="text-center mb-16">
              <Badge
                variant="secondary"
                class="mb-6 animate-float bg-blue-100/50 text-blue-700 border-blue-200 rounded-full px-4 py-2"
              >
                <Icon name="lucide:rocket" class="w-4 h-4 mr-1" /> FEATURES
              </Badge>
              <h2 class="text-4xl font-bold text-navy-900">
                Everything You Need<br />
                <span
                  class="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text"
                  >For Invoice Management</span
                >
              </h2>
            </div>

            <div class="grid md:grid-cols-2 gap-8 mb-12">
              <div
                class="bg-white/80 backdrop-blur-lg border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl shadow-[0_8px_32px_rgba(31,38,135,0.07)] p-8 flex flex-col"
              >
                <div class="mb-6">
                  <div
                    class="w-16 h-16 bg-blue-100/50 rounded-2xl flex items-center justify-center"
                  >
                    <Icon name="lucide:upload" class="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 class="text-xl font-bold text-navy-900 mt-4 mb-3">
                    Easy Upload
                  </h3>
                  <p class="text-gray-600">
                    Simple drag-and-drop interface for uploading invoices in PDF
                    and image formats.
                  </p>
                </div>
              </div>

              <div
                class="bg-white/80 backdrop-blur-lg border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl shadow-[0_8px_32px_rgba(31,38,135,0.07)] p-8 flex flex-col"
              >
                <div class="mb-6">
                  <div
                    class="w-16 h-16 bg-blue-100/50 rounded-2xl flex items-center justify-center"
                  >
                    <Icon name="lucide:search" class="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 class="text-xl font-bold text-navy-900 mt-4 mb-3">
                    Quick Search
                  </h3>
                  <p class="text-gray-600">
                    Find any invoice instantly with our powerful search
                    functionality.
                  </p>
                </div>
              </div>

              <div
                class="bg-white/80 backdrop-blur-lg border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl shadow-[0_8px_32px_rgba(31,38,135,0.07)] p-8 flex flex-col"
              >
                <div class="mb-6">
                  <div
                    class="w-16 h-16 bg-blue-100/50 rounded-2xl flex items-center justify-center"
                  >
                    <Icon name="lucide:shield" class="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 class="text-xl font-bold text-navy-900 mt-4 mb-3">
                    Secure Storage
                  </h3>
                  <p class="text-gray-600">
                    Your invoices are stored securely with enterprise-grade
                    encryption.
                  </p>
                </div>
              </div>

              <div
                class="bg-white/80 backdrop-blur-lg border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl shadow-[0_8px_32px_rgba(31,38,135,0.07)] p-8 flex flex-col"
              >
                <div class="mb-6">
                  <div
                    class="w-16 h-16 bg-blue-100/50 rounded-2xl flex items-center justify-center"
                  >
                    <Icon
                      name="lucide:file-text"
                      class="w-8 h-8 text-blue-600"
                    />
                  </div>
                  <h3 class="text-xl font-bold text-navy-900 mt-4 mb-3">
                    Smart Organization
                  </h3>
                  <p class="text-gray-600">
                    Automatic categorization and tagging of your invoices for
                    easy management.
                  </p>
                </div>
              </div>

              <div
                class="bg-white/80 backdrop-blur-lg border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl shadow-[0_8px_32px_rgba(31,38,135,0.07)] p-8 flex flex-col"
              >
                <div class="mb-6">
                  <div
                    class="w-16 h-16 bg-blue-100/50 rounded-2xl flex items-center justify-center"
                  >
                    <Icon
                      name="lucide:download"
                      class="w-8 h-8 text-blue-600"
                    />
                  </div>
                  <h3 class="text-xl font-bold text-navy-900 mt-4 mb-3">
                    Instant Download
                  </h3>
                  <p class="text-gray-600">
                    Download your invoices anytime, anywhere with a single
                    click.
                  </p>
                </div>
              </div>

              <div
                class="bg-white/80 backdrop-blur-lg border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl shadow-[0_8px_32px_rgba(31,38,135,0.07)] p-8 flex flex-col"
              >
                <div class="mb-6">
                  <div
                    class="w-16 h-16 bg-blue-100/50 rounded-2xl flex items-center justify-center"
                  >
                    <Icon
                      name="lucide:credit-card"
                      class="w-8 h-8 text-blue-600"
                    />
                  </div>
                  <h3 class="text-xl font-bold text-navy-900 mt-4 mb-3">
                    Flexible Plans
                  </h3>
                  <p class="text-gray-600">
                    Choose between free and paid tiers to match your business
                    needs.
                  </p>
                </div>
              </div>
            </div>

            <div
              class="bg-white/80 backdrop-blur-lg border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl shadow-[0_8px_32px_rgba(31,38,135,0.07)] p-8 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-3xl"
            >
              <div class="grid md:grid-cols-3 gap-6">
                <div class="text-center">
                  <h4 class="text-3xl font-bold mb-2">5+</h4>
                  <p class="text-sm opacity-90">Free Invoices</p>
                </div>
                <div class="text-center">
                  <h4 class="text-3xl font-bold mb-2">100%</h4>
                  <p class="text-sm opacity-90">Secure Storage</p>
                </div>
                <div class="text-center">
                  <h4 class="text-3xl font-bold mb-2">24/7</h4>
                  <p class="text-sm opacity-90">Access Anywhere</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-16 sm:mt-24">
          <div class="relative">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center">
              <span
                class="bg-white px-3 text-base font-semibold leading-6 text-gray-900"
              >
                Trusted by businesses worldwide
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useInvoiceProcessing } from "../composables/useInvoiceProcessing";
import { useNuxtApp } from "nuxt/app";
import { useAuth } from "../composables/useAuth";

const { user, initAuth } = useAuth();
const { processUploadedInvoice } = useInvoiceProcessing();

onMounted(async () => {
  await initAuth();

  // Watch for auth state changes to handle pending file
  if (user.value) {
    const pendingFile = localStorage.getItem("pendingInvoice");
    if (pendingFile) {
      try {
        const fileData = JSON.parse(pendingFile);
        const byteCharacters = atob(fileData.data.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const file = new File([byteArray], fileData.name, {
          type: fileData.type,
        });

        // Process the file
        processUploadedInvoice(file).then(() => {
          // Clear the pending file
          localStorage.removeItem("pendingInvoice");
        });
      } catch (error) {
        console.error("Error processing pending file:", error);
      }
    }
  }
});

const handleFileUpload = async (files) => {
  if (!files || files.length === 0) return;

  // Store the file temporarily in localStorage
  try {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const tempFile = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: e.target.result,
      };
      localStorage.setItem("pendingInvoice", JSON.stringify(tempFile));

      // Show success toast
      const { $showToast } = useNuxtApp();
      $showToast.success(
        "File stored successfully. Please log in to continue."
      );

      // Redirect to login page
      navigateTo("/login");
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error("Error storing file:", error);
    const { $showToast } = useNuxtApp();
    $showToast.error("Failed to store file. Please try again.");
  }
};
</script>

<style scoped>
.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
