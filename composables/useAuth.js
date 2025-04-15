export const useAuth = () => {
  const user = ref(null);
  const supabase = useSupabaseClient();

  const initAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      user.value = session.user;
    }

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        user.value = session.user;
      } else if (event === "SIGNED_OUT") {
        user.value = null;
      }
    });
  };

  return {
    user,
    initAuth,
  };
};
