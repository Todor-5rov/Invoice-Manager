<template>
  <header class="w-full z-50 fixed top-0 left-0">
    <div
      class="bg-white backdrop-blur-md shadow-sm transition-all duration-300 border-b border-white/10"
    >
      <div
        class="container mx-auto flex h-20 items-center justify-between px-4"
      >
        <!-- Logo -->
        <NuxtLink to="/" class="relative flex items-center space-x-3">
          <span
            class="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent"
            >Invoice Manager</span
          >
        </NuxtLink>

        <!-- Desktop navigation - simplified -->
        <div class="hidden md:flex items-center space-x-6">
          <!-- Navigation links -->
          <NuxtLink
            v-for="(item, index) in navigationItems"
            :key="index"
            :to="item.href"
            class="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
          >
            {{ item.name }}
          </NuxtLink>

          <!-- Login link -->
          <NuxtLink
            v-if="!user"
            to="/login"
            class="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
          >
            <span>Login</span>
          </NuxtLink>

          <!-- Profile dropdown when logged in -->
          <div v-else class="relative">
            <ClientOnly>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    class="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    <div class="flex items-center gap-3">
                      <div class="relative">
                        <img
                          v-if="user.avatar_url"
                          :src="user.avatar_url"
                          class="w-10 h-10 rounded-full object-cover"
                          alt="Profile"
                        />
                        <div
                          v-else
                          class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"
                        >
                          <Icon
                            name="lucide:user"
                            class="w-5 h-5 text-blue-600"
                          />
                        </div>
                      </div>
                      <span v-if="user.username" class="font-medium">{{
                        user.username
                      }}</span>
                    </div>
                    <Icon name="lucide:chevron-down" class="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <NuxtLink
                      to="/profile"
                      class="flex items-center cursor-pointer"
                    >
                      <Icon name="lucide:user" class="w-4 h-4 mr-2" />
                      <span>Profile</span>
                    </NuxtLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" @click="logout">
                    <Icon name="lucide:log-out" class="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ClientOnly>
          </div>
        </div>

        <!-- Mobile menu button -->
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              class="md:hidden text-gray-700 hover:text-blue-600 hover:bg-white/20 rounded-full"
            >
              <Icon name="lucide:menu" class="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            class="bg-white shadow-md border-l border-gray-200 p-8"
          >
            <SheetHeader>
              <SheetTitle class="text-xl">
                <span
                  class="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent"
                  >Invoice Manager</span
                >
              </SheetTitle>
            </SheetHeader>

            <div class="mt-10">
              <!-- Navigation links -->
              <div class="space-y-4">
                <NuxtLink
                  v-for="(item, index) in navigationItems"
                  :key="index"
                  :to="item.href"
                  class="block px-2 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg"
                >
                  {{ item.name }}
                </NuxtLink>
              </div>

              <hr class="my-8 border-gray-100" />

              <!-- Auth links -->
              <div class="space-y-4">
                <NuxtLink
                  v-if="!user"
                  to="/login"
                  class="block px-2 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg"
                >
                  Login
                </NuxtLink>

                <NuxtLink
                  v-if="user"
                  to="/profile"
                  class="block px-2 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg"
                >
                  Profile
                </NuxtLink>

                <button
                  v-if="user"
                  @click="logout"
                  class="w-full text-left px-2 py-3 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50/30 rounded-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
</template>

<script setup>
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const user = useState("user");
const supabase = useSupabaseClient();
const router = useRouter();

// Fetch profile data on mount and when user state changes
const fetchProfile = async () => {
  if (!user.value) return;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.value.id)
      .single();

    if (error) throw error;

    if (data) {
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
  }
};

// Watch for user state changes
watch(
  user,
  (newUser) => {
    if (newUser) {
      fetchProfile();
    }
  },
  { immediate: true }
);

// Watch for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN" && session) {
    user.value = session.user;
    fetchProfile();
  } else if (event === "SIGNED_OUT") {
    user.value = null;
  }
});

// Initialize auth state and profile on mount
onMounted(async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
    user.value = session.user;
    await fetchProfile();
  }
});

// Add route change watcher to ensure state consistency
watch(
  () => router.currentRoute.value,
  async () => {
    if (user.value) {
      await fetchProfile();
    }
  }
);

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Invoices", href: "/invoices" },
];

// Logout function
const logout = async () => {
  try {
    await supabase.auth.signOut();
    // Reset the user state
    user.value = null;
    // Redirect to home page
    router.push("/");
  } catch (error) {
    console.error("Error logging out:", error);
    if (toast) {
      toast.error("Error logging out");
    }
  }
};
</script>
