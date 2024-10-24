import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {

  if (!import.meta.client) {
    return;
  }

  const mainPage = "/";
  const authPage = "/auth";
  const authStore = useAuthStore();

  console.log(to, from);
  const token = authStore.getToken;
  const username = authStore.getUsername;

  if (token && !username) {
    await authStore.me();
    return navigateTo(to);
  }

  if (token && to.path === authPage) {
    return navigateTo(mainPage);
  }

  if (!token && to.path !== authPage && from.path !== authPage) {
    return navigateTo(authPage);
  }
});
