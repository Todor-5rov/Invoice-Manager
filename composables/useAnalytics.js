import { ref } from "vue";
import { useSupabaseClient } from "#imports";

export function useAnalytics() {
  const supabase = useSupabaseClient();
  const isLoading = ref(false);
  const error = ref(null);

  // Get summary statistics
  const getSummary = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const { data: invoices, error: fetchError } = await supabase
        .from("invoices")
        .select("*");

      if (fetchError) throw fetchError;

      const summary = {
        total_invoices: invoices.length,
        total_amount: invoices.reduce(
          (sum, invoice) => sum + (invoice.amount || 0),
          0
        ),
        pending_invoices: invoices.filter(
          (invoice) => invoice.status === "pending"
        ).length,
        paid_invoices: invoices.filter((invoice) => invoice.status === "paid")
          .length,
      };

      return summary;
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching summary:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    getSummary,
  };
}
