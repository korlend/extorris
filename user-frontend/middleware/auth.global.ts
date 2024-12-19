import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!import.meta.client) {
    return;
  }

  const mainPage = "/";
  const authPage = "/auth";
  const authStore = useAuthStore();

  const token = authStore.getToken;
  const localSession = authStore.getSession;

  if (token && !localSession.token) {
    const newSession = await authStore.me();
    if (!newSession?.token) {
      if (to.path === authPage) {
        return;
      }
      return navigateTo(authPage);
    }
    return navigateTo(to);
  }

  if (!token && to.path !== authPage) {
    return navigateTo(authPage);
  }

  if (localSession.token && to.path === authPage) {
    return navigateTo(mainPage);
  }
});
