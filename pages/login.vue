<template>
  <div>
    <div
      class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="mx-auto h-10 w-auto flex items-center justify-center">
          <div class="bg-blue-100 p-2 rounded-full">
            <Icon name="lucide:zap" class="h-6 w-6 text-blue-600" />
          </div>
          <span class="text-xl font-bold text-blue-600 ml-2"
            >Invoice Manager</span
          >
        </div>
        <h2
          class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
        >
          Вход
        </h2>
      </div>
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px] px-4">
        <div
          class="bg-white backdrop-blur-lg border border-white/50 shadow-sm transition-all duration-300 px-6 py-12 sm:rounded-3xl sm:px-12 shadow-[0_8px_32px_rgba(31,38,135,0.07)]"
        >
          <div>
            <div class="flex justify-center">
              <button
                type="button"
                :disabled="loading"
                class="flex w-full max-w-[240px] items-center justify-center gap-3 rounded-full bg-white bg-opacity-80 backdrop-blur-sm px-4 py-2.5 text-sm font-bold text-gray-900 shadow-sm ring-1 ring-inset ring-white/30 hover:bg-white focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 transition-all duration-200"
                @click="loginWithGoogle"
              >
                <Icon name="logos:google-icon" class="w-5 h-5" />
                Продължи с Google
              </button>
            </div>
            <div class="relative mt-10">
              <div
                class="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div class="w-full border-t border-gray-200" />
              </div>
              <div
                class="relative flex justify-center text-sm font-normal leading-6"
              >
                <span
                  class="bg-white backdrop-blur-sm px-6 text-gray-900 rounded-full"
                  >Или продължи с имейл</span
                >
              </div>
            </div>
          </div>

          <div v-if="emailSent" class="mt-6 text-center">
            <div
              class="mx-auto w-12 h-12 mb-4 flex items-center justify-center bg-green-100 rounded-full"
            >
              <Icon name="lucide:mail" class="h-6 w-6 text-green-600" />
            </div>
            <h3 class="text-lg font-medium text-gray-900">
              Проверете вашия имейл
            </h3>
            <p class="mt-2 text-sm text-gray-600">
              Изпратихме ви имейл с линк за вход. Моля проверете вашата поща и
              кликнете на линка.
            </p>
            <p class="mt-4 text-sm text-gray-500">
              Не виждате имейла? Проверете спам папката или
              <button
                class="text-blue-600 hover:text-blue-500 transition-colors"
                @click="emailSent = false"
              >
                опитайте отново
              </button>
            </p>
          </div>

          <form
            v-else
            class="mx-auto mt-6 max-w-[240px] space-y-6 signin-local-form"
            @submit.prevent="localLogin"
          >
            <div>
              <label for="email" class="block text-xs leading-6 text-gray-900"
                >Имейл адрес</label
              >
              <div class="mt-1">
                <input
                  id="email"
                  v-model="form.email"
                  data-form-type="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  placeholder="email@gmail.com"
                  required
                  class="block w-full rounded-full border-0 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all duration-200"
                  @keyup.enter="localLogin"
                  @click="scrollToLocalSignIn"
                />
              </div>
            </div>

            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div v-show="form.email.length > 0" class="mt-6">
                <button
                  type="submit"
                  :disabled="loading"
                  class="flex w-full justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 transition-all duration-200"
                >
                  <Icon
                    v-if="loading"
                    name="lucide:loader-2"
                    class="w-5 h-5 mr-2 animate-spin"
                  />
                  <Icon v-else name="lucide:mail" class="w-5 h-5 mr-2" />
                  {{ loading ? "Изпращане..." : "Изпрати линк за вход" }}
                </button>
              </div>
            </Transition>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();

if (user.value) {
  navigateTo("/");
}

const emailSent = ref(false);
const loading = ref(false);

const form = reactive({
  email: "",
});

async function localLogin(e: Event) {
  try {
    e.preventDefault();
    loading.value = true;

    if (!form.email) {
      toast({
        title: "Error",
        description: "Полето за имейл не може да е празно",
        variant: "destructive",
      });
      return;
    }

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: form.email,
      options: {
        emailRedirectTo: `${window.location.origin}/confirm`,
      },
    });

    if (authError) {
      toast({
        title: "Error",
        description: authError.message,
        variant: "destructive",
      });
      return;
    }

    emailSent.value = true;
    toast({
      title: "Success",
      description: "Изпратихме ви имейл с линк за вход",
      variant: "success",
    });
  } catch (err) {
    console.error(err);
    toast({
      title: "Error",
      description: "Получи се грешка. Моля опитайте отново.",
      variant: "destructive",
    });
  } finally {
    loading.value = false;
  }
}

async function loginWithGoogle() {
  try {
    loading.value = true;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/confirm`,
      },
    });

    console.info(JSON.stringify(data));

    if (error) {
      toast({
        title: "Error",
        description: "Грешка при вход с Google. Моля опитайте отново.",
        variant: "destructive",
      });
    }
  } catch (err) {
    console.error(err);
    toast({
      title: "Error",
      description: "Моля опитайте отново.",
      variant: "destructive",
    });
  } finally {
    loading.value = false;
  }
}

function scrollToLocalSignIn() {
  if (window.screen.height < 768) {
    setTimeout(() => {
      document.getElementsByClassName("signin-local-form")[0]?.scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: "smooth",
      });
    }, 300);
  }
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
