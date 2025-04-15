<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content with padding for fixed header -->
    <main class="container mx-auto px-4 pt-20 pb-8">
      <!-- File Upload Section -->
      <div class="max-w-4xl mx-auto mb-12">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-navy-900 mb-4">
            Upload Your Invoices
          </h2>
          <p class="text-gray-600">
            Drag and drop your invoices or click to browse. We support PDF and
            image formats.
          </p>
        </div>
        <div class="relative">
          <div
            class="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl opacity-50"
          ></div>
          <div class="relative p-8">
            <div
              class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
              @click.stop="handleUploadClick"
              @drop.prevent="handleDrop"
              @dragover.prevent
            >
              <input
                ref="fileInput"
                type="file"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.jpg,.jpeg,.png"
                @change="handleFileSelect"
              />
              <Icon
                name="lucide:upload"
                class="w-12 h-12 mx-auto text-gray-400 mb-4"
              />
              <p class="text-gray-600">
                Drag and drop your file here, or click to browse
              </p>
              <p class="text-sm text-gray-500 mt-2">
                Supported formats: PDF, JPG, PNG
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Dialog -->
      <Dialog v-model:open="isDeleteDialogOpen">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this invoice? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div class="flex justify-end gap-2 mt-4">
            <Button variant="outline" @click="isDeleteDialogOpen = false">
              Cancel
            </Button>
            <Button variant="destructive" @click="confirmDelete">
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <!-- Notes Dialog -->
      <Dialog v-model:open="isNotesDialogOpen">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invoice Notes</DialogTitle>
            <DialogDescription>
              Add or edit notes for this invoice
            </DialogDescription>
          </DialogHeader>
          <div class="py-4">
            <Textarea
              v-model="currentNotes"
              placeholder="Enter your notes here..."
              class="min-h-[100px]"
            />
          </div>
          <div class="flex justify-end gap-2">
            <Button variant="outline" @click="isNotesDialogOpen = false">
              Cancel
            </Button>
            <Button @click="saveNotes" :disabled="isSavingNotes">
              <Icon
                v-if="isSavingNotes"
                name="lucide:loader-2"
                class="h-4 w-4 mr-2 animate-spin"
              />
              Save Notes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <!-- Invoices List -->
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold">Your Invoices</h2>
        </div>

        <div v-if="isLoading" class="flex justify-center items-center h-32">
          <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin" />
        </div>

        <div v-else-if="error" class="text-red-500">
          {{ error }}
        </div>

        <div v-else-if="invoices.length === 0" class="text-center py-8">
          <p class="text-gray-500">
            No invoices found. Upload your first invoice!
          </p>
        </div>

        <div v-else class="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issuer</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="invoice in invoices" :key="invoice.id">
                <TableCell class="font-medium">
                  {{ invoice.issuer_name || "Unknown" }}
                </TableCell>
                <TableCell>
                  <Badge v-if="invoice.document_number" variant="outline">
                    {{ invoice.document_number }}
                  </Badge>
                  <span v-else class="text-gray-400">N/A</span>
                </TableCell>
                <TableCell>{{ formatDate(invoice.issue_date) }}</TableCell>
                <TableCell>
                  {{
                    formatCurrency(invoice.transaction_amount, invoice.currency)
                  }}
                </TableCell>
                <TableCell>{{ invoice.recipient_name || "N/A" }}</TableCell>
                <TableCell>
                  <div
                    v-if="invoice.notes"
                    class="max-w-[200px] truncate text-sm text-gray-600"
                  >
                    {{ invoice.notes }}
                  </div>
                  <span v-else class="text-gray-400">No notes</span>
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end gap-2">
                    <Button
                      @click="openNotesDialog(invoice)"
                      variant="outline"
                      size="sm"
                      class="relative"
                    >
                      <Icon name="lucide:file-text" class="h-4 w-4" />
                      <Badge
                        v-if="invoice.notes"
                        variant="secondary"
                        class="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                      >
                        <Icon name="lucide:check" class="h-3 w-3" />
                      </Badge>
                    </Button>
                    <Button
                      @click="downloadInvoice(invoice)"
                      variant="outline"
                      size="sm"
                    >
                      <Icon name="lucide:download" class="h-4 w-4" />
                    </Button>
                    <Button
                      @click="deleteInvoice(invoice)"
                      variant="destructive"
                      size="sm"
                    >
                      <Icon name="lucide:trash-2" class="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useSupabaseClient } from "#imports";
import { useInvoiceProcessing } from "~/composables/useInvoiceProcessing";
import { useToast } from "~/composables/useToast";

const fileInput = ref(null);
const selectedFile = ref(null);
const invoices = ref([]);
const isLoading = ref(true);
const error = ref(null);
const supabase = useSupabaseClient();
const user = useState("user");
const { processUploadedInvoice } = useInvoiceProcessing();
const { toast } = useToast();
const isDeleteDialogOpen = ref(false);
const invoiceToDelete = ref(null);
const isNotesDialogOpen = ref(false);
const currentNotes = ref("");
const invoiceToEdit = ref(null);
const isSavingNotes = ref(false);

// Check authentication on mount
onMounted(async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    navigateTo("/login");
    return;
  }
  user.value = session.user;
  fetchInvoices();
});

// Watch for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN" && session) {
    user.value = session.user;
    fetchInvoices();
  } else if (event === "SIGNED_OUT") {
    user.value = null;
    invoices.value = [];
    navigateTo("/login");
  }
});

const checkAuth = () => {
  if (!user.value) {
    toast({
      title: "Authentication Required",
      description: "Please log in to upload files",
      variant: "destructive",
    });
    navigateTo("/login");
    return false;
  }
  return true;
};

const handleUploadClick = (event) => {
  event.preventDefault();
  if (!checkAuth()) return;
  const clickEvent = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  fileInput.value?.dispatchEvent(clickEvent);
};

const handleFileSelect = (event) => {
  if (!checkAuth()) return;
  const files = event.target.files;
  if (files && files.length > 0) {
    selectedFile.value = files[0];
    uploadFile();
  }
};

const handleDrop = (event) => {
  event.preventDefault();
  if (!checkAuth()) return;
  const files = event.dataTransfer.files;
  if (files && files.length > 0) {
    selectedFile.value = files[0];
    uploadFile();
  }
};

const uploadFile = async () => {
  if (!selectedFile.value) return;
  if (!checkAuth()) return;

  try {
    const uploadResult = await processUploadedInvoice(selectedFile.value);
    if (!uploadResult.success) {
      throw new Error(uploadResult.error);
    }

    // Reset the file input and selected file
    if (fileInput.value) {
      fileInput.value.value = "";
    }
    selectedFile.value = null;

    fetchInvoices();

    toast({
      title: "Success",
      description: "File uploaded and processed successfully",
      variant: "success",
    });
  } catch (error) {
    console.error("Upload error:", error);
    toast({
      title: "Upload Failed",
      description: error.message,
      variant: "destructive",
    });
  }
};

const downloadInvoice = async (invoice) => {
  try {
    const {
      data: { publicUrl },
    } = supabase.storage.from("invoices").getPublicUrl(invoice.file_path);

    const response = await fetch(publicUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = invoice.file_name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Download error:", error);
    toast({
      title: "Download Failed",
      description: "Failed to download invoice",
      variant: "destructive",
    });
  }
};

const deleteInvoice = (invoice) => {
  invoiceToDelete.value = invoice;
  isDeleteDialogOpen.value = true;
};

const confirmDelete = async () => {
  if (!invoiceToDelete.value) return;

  try {
    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from("invoices")
      .remove([invoiceToDelete.value.file_path]);

    if (storageError) throw storageError;

    // Delete record from database
    const { error: dbError } = await supabase
      .from("invoices")
      .delete()
      .eq("id", invoiceToDelete.value.id);

    if (dbError) throw dbError;

    // Remove from local state and force a refresh
    invoices.value = invoices.value.filter(
      (i) => i.id !== invoiceToDelete.value.id
    );

    // Force a refresh of the invoices list
    await fetchInvoices();

    toast({
      title: "Success",
      description: "Invoice deleted successfully",
      variant: "success",
    });
  } catch (error) {
    console.error("Delete error:", error);
    toast({
      title: "Delete Failed",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    isDeleteDialogOpen.value = false;
    invoiceToDelete.value = null;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

const formatCurrency = (amount, currency) => {
  if (!amount) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "EUR",
  }).format(amount);
};

const fetchInvoices = async () => {
  if (!user.value) return;

  try {
    isLoading.value = true;
    const { data, error: fetchError } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", user.value.id)
      .order("upload_date", { ascending: false });

    if (fetchError) throw fetchError;
    invoices.value = data;
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const openNotesDialog = (invoice) => {
  invoiceToEdit.value = invoice;
  currentNotes.value = invoice.notes || "";
  isNotesDialogOpen.value = true;
};

const saveNotes = async () => {
  if (!invoiceToEdit.value) return;

  try {
    isSavingNotes.value = true;
    const { error } = await supabase
      .from("invoices")
      .update({ notes: currentNotes.value })
      .eq("id", invoiceToEdit.value.id);

    if (error) throw error;

    // Update local state
    const index = invoices.value.findIndex(
      (i) => i.id === invoiceToEdit.value.id
    );
    if (index !== -1) {
      invoices.value[index] = {
        ...invoices.value[index],
        notes: currentNotes.value,
      };
    }

    toast({
      title: "Success",
      description: "Notes saved successfully",
      variant: "success",
    });

    isNotesDialogOpen.value = false;
  } catch (error) {
    console.error("Error saving notes:", error);
    toast({
      title: "Error",
      description: "Failed to save notes",
      variant: "destructive",
    });
  } finally {
    isSavingNotes.value = false;
  }
};
</script>
