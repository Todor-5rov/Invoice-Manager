<script setup>
import { ref, onMounted, computed } from "vue";
import { useAnalytics } from "@/composables/useAnalytics";

const { getSummary, isLoading, error } = useAnalytics();
const summary = ref(null);

const summaryCards = computed(() => {
  if (!summary.value) return [];
  return [
    {
      label: "Total Invoices",
      value: summary.value.total_invoices,
      icon: "lucide:file-text",
      bgColor: "bg-blue-100",
    },
    {
      label: "Total Amount",
      value: formatCurrency(summary.value.total_amount),
      icon: "lucide:dollar-sign",
      bgColor: "bg-green-100",
    },
    {
      label: "Pending Invoices",
      value: summary.value.pending_invoices,
      icon: "lucide:clock",
      bgColor: "bg-yellow-100",
    },
    {
      label: "Paid Invoices",
      value: summary.value.paid_invoices,
      icon: "lucide:check-circle",
      bgColor: "bg-purple-100",
    },
  ];
});

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const loadData = async () => {
  summary.value = await getSummary();
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="(stat, index) in summaryCards"
        :key="index"
        class="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ stat.label }}</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">
              {{ stat.value }}
            </p>
          </div>
          <div class="p-3 rounded-full" :class="stat.bgColor">
            <Icon :name="stat.icon" class="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
