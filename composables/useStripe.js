export const useStripe = () => {
  const supabase = useSupabaseClient();
  const user = useState("user");
  const config = useRuntimeConfig();

  // Create or get Stripe customer
  const createOrGetCustomer = async () => {
    try {
      // Check if user already has a subscription
      const { data: existingSubscription, error: fetchError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.value.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

      if (existingSubscription?.stripe_customer_id) {
        return existingSubscription.stripe_customer_id;
      }

      // Create new customer in Stripe
      const response = await $fetch("/api/stripe/create-customer", {
        method: "POST",
        body: {
          email: user.value.email,
          name: user.value.user_metadata?.full_name || "",
        },
      });

      if (!response.customerId)
        throw new Error("Failed to create Stripe customer");

      // Create subscription record in database
      const { error: insertError } = await supabase
        .from("subscriptions")
        .insert({
          user_id: user.value.id,
          stripe_customer_id: response.customerId,
          tier: "free",
          monthly_upload_limit: 5,
          uploads_used: 0,
        });

      if (insertError) throw insertError;

      return response.customerId;
    } catch (error) {
      console.error("Error creating/getting customer:", error);
      throw error;
    }
  };

  // Create subscription checkout session
  const createCheckoutSession = async () => {
    try {
      const customerId = await createOrGetCustomer();

      const response = await $fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        body: {
          customerId,
          priceId: config.public.stripePriceId, // Placeholder price ID
        },
      });

      if (!response.url) throw new Error("Failed to create checkout session");

      // Redirect to Stripe Checkout
      window.location.href = response.url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    }
  };

  // Get subscription status
  const getSubscriptionStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.value.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error getting subscription status:", error);
      throw error;
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    try {
      const { data: subscription, error: fetchError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.value.id)
        .single();

      if (fetchError) throw fetchError;
      if (!subscription.stripe_subscription_id)
        throw new Error("No active subscription");

      const response = await $fetch("/api/stripe/cancel-subscription", {
        method: "POST",
        body: {
          subscriptionId: subscription.stripe_subscription_id,
        },
      });

      if (!response.success) throw new Error("Failed to cancel subscription");

      // Update subscription status in database
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({
          status: "cancelled",
          tier: "free",
          monthly_upload_limit: 5,
        })
        .eq("user_id", user.value.id);

      if (updateError) throw updateError;

      return true;
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      throw error;
    }
  };

  return {
    createOrGetCustomer,
    createCheckoutSession,
    getSubscriptionStatus,
    cancelSubscription,
  };
};
