<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">Your Invoices</h2>
      <div class="flex gap-2">
        <Button @click="handleFileSelect" variant="outline">
          <Icon name="lucide:upload" class="mr-2 h-4 w-4" />
          Upload Invoice
        </Button>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-32">
      <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin" />
    </div>

    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>

    <div v-else-if="invoices.length === 0" class="text-center py-8">
      <p class="text-gray-500">No invoices found. Upload your first invoice!</p>
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
              {{ formatCurrency(invoice.transaction_amount, invoice.currency) }}
            </TableCell>
            <TableCell>{{ invoice.recipient_name || "N/A" }}</TableCell>
            <TableCell class="text-right">
              <div class="flex justify-end gap-2">
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

    <input
      ref="fileInput"
      type="file"
      class="hidden"
      accept=".pdf,.jpg,.jpeg,.png"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup>
// ... existing imports ...

const supabase = useSupabaseClient();
const user = useState("user");
const fileInput = ref(null);
const invoices = ref([]);
const isLoading = ref(true);
const error = ref(null);

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

// Format currency helper
const formatCurrency = (amount, currency) => {
  if (!amount) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "EUR",
  }).format(amount);
};

// Fetch invoices
const fetchInvoices = async () => {
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

// Delete invoice
const deleteInvoice = async (invoice) => {
  try {
    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from("invoices")
      .remove([invoice.file_path]);

    if (storageError) throw storageError;

    // Delete record from database
    const { error: dbError } = await supabase
      .from("invoices")
      .delete()
      .eq("id", invoice.id);

    if (dbError) throw dbError;

    // Remove from local state
    invoices.value = invoices.value.filter((i) => i.id !== invoice.id);
  } catch (err) {
    error.value = err.message;
  }
};

// ... existing handleFileSelect and handleFileChange functions ...

onMounted(() => {
  fetchInvoices();
});
</script>
// ... existing code ...
