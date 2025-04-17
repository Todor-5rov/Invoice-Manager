export const useUploadLimits = () => {
  const supabase = useSupabaseClient();
  const user = useState("user");
  const { toast } = useToast();

  // Check if user can upload
  const canUpload = async () => {
    try {
      const { data: subscription, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.value.id)
        .single();

      if (error) throw error;

      // For free tier, check total uploads
      if (subscription.tier === "free") {
        const { count } = await supabase
          .from("invoices")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.value.id);

        if (count >= subscription.monthly_upload_limit) {
          toast({
            title: "Upload Limit Reached",
            description:
              "You've reached your upload limit. Upgrade to Pro for more uploads.",
            variant: "destructive",
          });
          return false;
        }
      }
      // For paid tier, check monthly uploads
      else {
        if (subscription.uploads_used >= subscription.monthly_upload_limit) {
          toast({
            title: "Monthly Upload Limit Reached",
            description:
              "You've reached your monthly upload limit. Additional uploads will be charged.",
            variant: "destructive",
          });
          return true; // Still allow uploads but will charge extra
        }
      }

      // Check if approaching limit
      if (
        subscription.tier === "free" &&
        subscription.uploads_used >= subscription.monthly_upload_limit - 1
      ) {
        toast({
          title: "Upload Limit Warning",
          description:
            "You're approaching your upload limit. Upgrade to Pro for more uploads.",
          variant: "warning",
        });
      } else if (
        subscription.tier === "paid" &&
        subscription.uploads_used >= subscription.monthly_upload_limit - 5
      ) {
        toast({
          title: "Monthly Upload Limit Warning",
          description:
            "You're approaching your monthly upload limit. Additional uploads will be charged.",
          variant: "warning",
        });
      }

      return true;
    } catch (error) {
      console.error("Error checking upload limits:", error);
      return false;
    }
  };

  // Increment upload count
  const incrementUploadCount = async () => {
    try {
      const { data: subscription, error: fetchError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.value.id)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({
          uploads_used: subscription.uploads_used + 1,
        })
        .eq("user_id", user.value.id);

      if (updateError) throw updateError;
    } catch (error) {
      console.error("Error incrementing upload count:", error);
    }
  };

  return {
    canUpload,
    incrementUploadCount,
  };
};
