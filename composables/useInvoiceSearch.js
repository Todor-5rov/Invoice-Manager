export const useInvoiceSearch = () => {
  const supabase = useSupabaseClient();

  const searchInvoices = async (query, userId) => {
    if (!query) {
      // If no query, return all invoices
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", userId)
        .order("upload_date", { ascending: false });

      if (error) throw error;
      return data;
    }

    try {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", userId)
        .or(
          `issuer_name.ilike.%${query}%,document_number.ilike.%${query}%,recipient_name.ilike.%${query}%,notes.ilike.%${query}%`
        )
        .order("upload_date", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error searching invoices:", error);
      throw error;
    }
  };

  return {
    searchInvoices,
  };
};
