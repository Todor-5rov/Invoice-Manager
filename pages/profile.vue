<template>
  <div class="bg-gradient-to-b from-blue-50 to-white min-h-screen pt-12 pb-16">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Page Header -->
        <div class="text-center mb-12">
          <Badge
            variant="secondary"
            class="mb-6 bg-blue-100/50 text-blue-700 border-blue-200 rounded-full px-4 py-2 animate-[float_3s_ease-in-out_infinite]"
          >
            <Icon name="lucide:user" class="w-4 h-4 mr-1" /> PROFILE
          </Badge>
          <h1 class="text-4xl font-bold text-navy-900">
            Your
            <span
              class="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text"
              >Profile</span
            >
          </h1>
        </div>

        <div
          v-if="!user"
          class="bg-white/80 backdrop-blur-lg border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl shadow-[0_8px_32px_rgba(31,38,135,0.07)] p-8 text-center"
        >
          <Icon
            name="lucide:user-x"
            class="w-16 h-16 mx-auto mb-4 text-gray-400"
          />
          <h2 class="text-2xl font-bold text-gray-700 mb-4">Not Logged In</h2>
          <p class="text-gray-600 mb-6">Please log in to view your profile</p>
          <NuxtLink to="/login">
            <Button class="rounded-full">
              <Icon name="lucide:log-in" class="w-4 h-4 mr-2" />
              Login
            </Button>
          </NuxtLink>
        </div>

        <div v-else>
          <!-- Profile Section -->
          <div
            class="bg-white/80 backdrop-blur-lg border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl shadow-[0_8px_32px_rgba(31,38,135,0.07)] p-8 mb-8"
          >
            <div class="flex flex-col md:flex-row items-center gap-8">
              <!-- Avatar -->
              <div class="relative">
                <ProfileAvatar
                  v-model:path="avatarPath"
                  size="8rem"
                  @upload="updateAvatarInProfile"
                />
              </div>

              <!-- Profile Info -->
              <div class="flex-1 text-center md:text-left">
                <h2 class="text-2xl font-bold text-navy-900 mb-2">
                  {{ user.username || user.email || "User" }}
                </h2>
                <p class="text-gray-600 mb-4">{{ user.email }}</p>
                <div
                  class="flex flex-wrap gap-2 justify-center md:justify-start"
                >
                  <Badge
                    variant="outline"
                    class="bg-blue-50/50 text-blue-700 border-blue-200 rounded-full"
                  >
                    Member
                  </Badge>
                  <Badge
                    variant="outline"
                    class="bg-green-50/50 text-green-700 border-green-200 rounded-full"
                  >
                    <Icon name="lucide:check" class="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <!-- Account Details -->
          <div
            class="bg-white/80 backdrop-blur-lg border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl shadow-[0_8px_32px_rgba(31,38,135,0.07)] p-8 mb-8"
          >
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold text-navy-900">Account Details</h3>
              <Button
                variant="outline"
                class="rounded-full"
                @click="isEditing = !isEditing"
              >
                <Icon
                  :name="isEditing ? 'lucide:x' : 'lucide:pencil'"
                  class="w-4 h-4 mr-2"
                />
                {{ isEditing ? "Cancel" : "Edit" }}
              </Button>
            </div>

            <form @submit.prevent="updateProfile">
              <div class="space-y-6">
                <!-- Username -->
                <div>
                  <Label for="username">Username</Label>
                  <Input
                    id="username"
                    v-model="profileForm.username"
                    placeholder="Your username"
                    :disabled="!isEditing"
                    class="rounded-full"
                  />
                </div>

                <!-- Full Name -->
                <div>
                  <Label for="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    v-model="profileForm.full_name"
                    placeholder="Your full name"
                    :disabled="!isEditing"
                    class="rounded-full"
                  />
                </div>

                <!-- Email -->
                <div>
                  <Label for="email">Email</Label>
                  <Input
                    id="email"
                    v-model="profileForm.email"
                    type="email"
                    placeholder="Your email"
                    disabled
                    class="rounded-full"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Email address cannot be changed
                  </p>
                </div>

                <!-- Save Button -->
                <div v-if="isEditing" class="flex justify-end">
                  <Button
                    type="submit"
                    :disabled="isSaving"
                    class="rounded-full"
                  >
                    <Icon
                      v-if="isSaving"
                      name="lucide:loader-2"
                      class="w-4 h-4 mr-2 animate-spin"
                    />
                    <Icon v-else name="lucide:save" class="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <!-- Danger Zone -->
          <div
            class="bg-white/50 backdrop-blur-lg border border-red-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl shadow-[0_8px_32px_rgba(31,38,135,0.07)] p-8"
          >
            <h3 class="text-xl font-bold text-red-600 mb-6">Danger Zone</h3>

            <div class="space-y-6">
              <!-- Delete Account -->
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-gray-900">Delete Account</h4>
                  <p class="text-sm text-gray-500">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  class="rounded-full"
                  @click="confirmDelete = true"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Confirmation -->
    <Dialog :open="confirmDelete" @update:open="confirmDelete = $event">
      <DialogContent
        class="rounded-3xl bg-white/90 backdrop-blur-md border border-white/30"
      >
        <DialogHeader>
          <DialogTitle class="text-red-600">Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div class="py-4">
          <p class="text-gray-600">
            All your personal data will be permanently removed. This includes:
          </p>
          <ul class="list-disc ml-5 mt-2 space-y-1 text-gray-600">
            <li>Profile information</li>
            <li>Your preferences</li>
            <li>All associated data</li>
          </ul>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            @click="confirmDelete = false"
            class="rounded-full"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            @click="deleteAccount"
            :disabled="isDeleting"
            class="rounded-full"
          >
            <Icon
              v-if="isDeleting"
              name="lucide:loader-2"
              class="w-4 h-4 mr-2 animate-spin"
            />
            Delete Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
const user = useState("user");
const supabase = useSupabaseClient();
const router = useRouter();

// State for editing mode
const isEditing = ref(false);
const isSaving = ref(false);
const confirmDelete = ref(false);
const isDeleting = ref(false);
const avatarPath = ref(null);
const isLoading = ref(true);

// Form state for profile
const profileForm = ref({
  username: "",
  full_name: "",
  email: "",
});

// Fetch profile data
const fetchProfile = async () => {
  if (!user.value) return;

  try {
    isLoading.value = true;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.value.id)
      .single();

    if (error) throw error;

    if (data) {
      // Update form with profile data
      profileForm.value = {
        username: data.username || "",
        full_name: data.full_name || "",
        email: user.value.email || "",
      };

      // Set avatar path if exists
      avatarPath.value = data.avatar_url || null;

      // Update local user state with profile data
      user.value = {
        ...user.value,
        username: data.username,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
      };
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    toast({
      title: "Error",
      description: "There was an error loading your profile data.",
      variant: "destructive",
    });
  } finally {
    isLoading.value = false;
  }
};

// Initialize form with user data when available
watch(
  user,
  (newValue) => {
    if (newValue) {
      fetchProfile();
    }
  },
  { immediate: true }
);

// Handle avatar update
const updateAvatarInProfile = async () => {
  if (!user.value || !avatarPath.value) return;

  try {
    // Get the public URL for the avatar
    const {
      data: { publicUrl },
    } = supabase.storage.from("files").getPublicUrl(avatarPath.value);

    // Update the profile with the public URL
    const { error } = await supabase
      .from("profiles")
      .update({
        avatar_url: publicUrl,
        updated_at: new Date(),
      })
      .eq("id", user.value.id);

    if (error) throw error;

    // Update local user state with the public URL
    user.value = {
      ...user.value,
      avatar_url: publicUrl,
    };

    toast({
      title: "Profile updated",
      description: "Your profile picture has been updated.",
      variant: "default",
    });
  } catch (error) {
    console.error("Error updating avatar:", error);
    toast({
      title: "Error",
      description: "There was an error updating your profile picture.",
      variant: "destructive",
    });
  }
};

// Update profile function
const updateProfile = async () => {
  if (!user.value) return;

  isSaving.value = true;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        username: profileForm.value.username,
        full_name: profileForm.value.full_name,
        updated_at: new Date(),
      })
      .eq("id", user.value.id);

    if (error) throw error;

    // Update local user state
    user.value = {
      ...user.value,
      username: profileForm.value.username,
      full_name: profileForm.value.full_name,
    };

    isEditing.value = false;
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
      variant: "default",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    toast({
      title: "Error",
      description: "There was an error updating your profile.",
      variant: "destructive",
    });
  } finally {
    isSaving.value = false;
  }
};

// Delete account function
const deleteAccount = async () => {
  if (!user.value) return;

  isDeleting.value = true;

  try {
    // Delete user profile
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user.value.id);

    if (profileError) throw profileError;

    // Delete user authentication
    const { error: authError } = await supabase.auth.admin.deleteUser(
      user.value.id
    );

    if (authError) throw authError;

    // Sign out
    await supabase.auth.signOut();

    // Reset user state
    user.value = null;

    // Redirect to home
    router.push("/");

    toast({
      title: "Account deleted",
      description: "Your account has been successfully deleted.",
      variant: "default",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    toast({
      title: "Error",
      description: "There was an error deleting your account.",
      variant: "destructive",
    });
  } finally {
    isDeleting.value = false;
    confirmDelete.value = false;
  }
};

// Authentication guard - redirect if not logged in
onMounted(() => {
  // Short delay to ensure user state is loaded
  setTimeout(() => {
    if (!user.value && process.client) {
      router.push("/login");
      toast({
        title: "Login required",
        description: "Please log in to view your profile.",
        variant: "destructive",
      });
    }
  }, 500);
});
useHead({
  title: "Profile - AI Starter Kit",
  meta: [
    {
      name: "description",
      content: "Manage your profile settings and account details",
    },
  ],
});
</script>
