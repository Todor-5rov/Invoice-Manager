<script setup>
const searchQuery = ref("");
const startDate = ref(null);
const endDate = ref(null);
const minAmount = ref(null);
const maxAmount = ref(null);
const selectedStatus = ref(null);
const selectedTags = ref([]);
const sortBy = ref("upload_date");
const sortOrder = ref("desc");

const { searchInvoices, getAvailableFilters } = useInvoiceSearch();
const { getTags } = useTags();

const availableFilters = ref({
  statuses: [],
  tags: [],
});

const emit = defineEmits(["search"]);

// Load available filters
onMounted(async () => {
  const filters = await getAvailableFilters();
  availableFilters.value = filters;
});

// Watch for changes and emit search
watch(
  [
    searchQuery,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    selectedStatus,
    selectedTags,
    sortBy,
    sortOrder,
  ],
  async () => {
    const results = await searchInvoices({
      query: searchQuery.value,
      startDate: startDate.value,
      endDate: endDate.value,
      minAmount: minAmount.value,
      maxAmount: maxAmount.value,
      status: selectedStatus.value,
      tags: selectedTags.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    });
    emit("search", results);
  },
  { immediate: true }
);
</script>

<template>
  <div class="space-y-4">
    <!-- Search Bar -->
    <div class="flex gap-2">
      <Input
        v-model="searchQuery"
        placeholder="Search invoices..."
        class="flex-1"
      />
      <Button variant="outline" @click="searchQuery = ''">
        <Icon name="lucide:x" class="h-4 w-4" />
      </Button>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Date Range -->
      <div class="space-y-2">
        <Label>Date Range</Label>
        <div class="flex gap-2">
          <Input
            type="date"
            v-model="startDate"
            placeholder="Start Date"
            class="flex-1"
          />
          <Input
            type="date"
            v-model="endDate"
            placeholder="End Date"
            class="flex-1"
          />
        </div>
      </div>

      <!-- Amount Range -->
      <div class="space-y-2">
        <Label>Amount Range</Label>
        <div class="flex gap-2">
          <Input
            type="number"
            v-model="minAmount"
            placeholder="Min Amount"
            class="flex-1"
          />
          <Input
            type="number"
            v-model="maxAmount"
            placeholder="Max Amount"
            class="flex-1"
          />
        </div>
      </div>

      <!-- Status -->
      <div class="space-y-2">
        <Label>Status</Label>
        <Select v-model="selectedStatus">
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem :value="null">All</SelectItem>
            <SelectItem
              v-for="status in availableFilters.statuses"
              :key="status"
              :value="status"
            >
              {{ status }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Tags -->
      <div class="space-y-2">
        <Label>Tags</Label>
        <Select v-model="selectedTags" multiple>
          <SelectTrigger>
            <SelectValue placeholder="Select tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="tag in availableFilters.tags"
              :key="tag.id"
              :value="tag.id"
            >
              <div class="flex items-center gap-2">
                <div
                  class="h-3 w-3 rounded-full"
                  :style="{ backgroundColor: tag.color }"
                />
                {{ tag.name }}
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Sort -->
      <div class="space-y-2">
        <Label>Sort By</Label>
        <div class="flex gap-2">
          <Select v-model="sortBy">
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upload_date">Date</SelectItem>
              <SelectItem value="total_amount">Amount</SelectItem>
              <SelectItem value="issuer_name">Issuer</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
          >
            <Icon
              :name="
                sortOrder === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'
              "
              class="h-4 w-4"
            />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
