<template>
  <div class="min-h-screen bg-gray-50">
    <main class="container mx-auto px-4 pt-20 pb-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-navy-900 mb-8">
          Subscription Management
        </h1>

        <!-- Current Plan -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 class="text-xl font-semibold mb-4">Current Plan</h2>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-lg font-medium">
                {{ subscription?.tier === "paid" ? "Pro Plan" : "Free Plan" }}
              </p>
              <p class="text-gray-600">
                {{ subscription?.uploads_used }}/{{
                  subscription?.monthly_upload_limit
                }}
                uploads used this month
              </p>
            </div>
            <div v-if="subscription?.tier === 'free'">
              <Button @click="upgradeToPro">Upgrade to Pro</Button>
            </div>
            <div v-else>
              <Button variant="outline" @click="handleCancelSubscription"
                >Cancel Subscription</Button
              >
            </div>
          </div>
        </div>

        <!-- Plan Comparison -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Free Plan -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-xl font-semibold mb-4">Free Plan</h3>
            <ul class="space-y-2 mb-6">
              <li class="flex items-center">
                <Icon name="lucide:check" class="h-5 w-5 text-green-500 mr-2" />
                <span>5 total invoice uploads</span>
              </li>
              <li class="flex items-center">
                <Icon name="lucide:check" class="h-5 w-5 text-green-500 mr-2" />
                <span>Basic invoice management</span>
              </li>
              <li class="flex items-center">
                <Icon name="lucide:check" class="h-5 w-5 text-green-500 mr-2" />
                <span>Notes and editing</span>
              </li>
            </ul>
            <p class="text-2xl font-bold mb-4">$0/month</p>
            <Button
              v-if="subscription?.tier === 'free'"
              variant="outline"
              class="w-full"
              disabled
            >
              Current Plan
            </Button>
            <Button
              v-else
              variant="outline"
              class="w-full"
              @click="downgradeToFree"
            >
              Downgrade
            </Button>
          </div>

          <!-- Pro Plan -->
          <div
            class="bg-white rounded-lg shadow-sm p-6 border-2 border-blue-500"
          >
            <div
              class="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg"
            >
              Popular
            </div>
            <h3 class="text-xl font-semibold mb-4">Pro Plan</h3>
            <ul class="space-y-2 mb-6">
              <li class="flex items-center">
                <Icon name="lucide:check" class="h-5 w-5 text-green-500 mr-2" />
                <span>50 monthly invoice uploads</span>
              </li>
              <li class="flex items-center">
                <Icon name="lucide:check" class="h-5 w-5 text-green-500 mr-2" />
                <span>Advanced invoice management</span>
              </li>
              <li class="flex items-center">
                <Icon name="lucide:check" class="h-5 w-5 text-green-500 mr-2" />
                <span>Priority support</span>
              </li>
              <li class="flex items-center">
                <Icon name="lucide:check" class="h-5 w-5 text-green-500 mr-2" />
                <span>Additional uploads available</span>
              </li>
            </ul>
            <p class="text-2xl font-bold mb-4">$9.99/month</p>
            <Button
              v-if="subscription?.tier === 'paid'"
              variant="outline"
              class="w-full"
              disabled
            >
              Current Plan
            </Button>
            <Button v-else class="w-full" @click="upgradeToPro">
              Upgrade
            </Button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useStripe } from "~/composables/useStripe";
import { useToast } from "~/composables/useToast";

const { createCheckoutSession, getSubscriptionStatus, cancelSubscription } =
  useStripe();
const { toast } = useToast();
const subscription = ref(null);
const isLoading = ref(false);

// Fetch subscription status on mount
onMounted(async () => {
  try {
    subscription.value = await getSubscriptionStatus();
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    toast({
      title: "Error",
      description: "Failed to load subscription status",
      variant: "destructive",
    });
  }
});

// Upgrade to Pro plan
const upgradeToPro = async () => {
  try {
    isLoading.value = true;
    await createCheckoutSession();
  } catch (error) {
    console.error("Error upgrading to Pro:", error);
    toast({
      title: "Error",
      description: "Failed to upgrade subscription",
      variant: "destructive",
    });
  } finally {
    isLoading.value = false;
  }
};

// Cancel subscription
const handleCancelSubscription = async () => {
  try {
    isLoading.value = true;
    await cancelSubscription();
    subscription.value = await getSubscriptionStatus();
    toast({
      title: "Success",
      description: "Subscription cancelled successfully",
      variant: "success",
    });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    toast({
      title: "Error",
      description: "Failed to cancel subscription",
      variant: "destructive",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
