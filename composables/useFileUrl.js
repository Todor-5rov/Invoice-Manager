export function useFileUrl() {
  const supabase = useSupabaseClient();

  const getPublicUrl = (filePath) => {
    if (!filePath) return null;

    const { data } = supabase.storage.from("invoices").getPublicUrl(filePath);

    return data.publicUrl;
  };

  return {
    getPublicUrl,
  };
}
