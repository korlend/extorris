<template>
  <div class="auth">
    <CommonLoader class="auth-block" :active="isLoading">
      <v-text-field
        v-model="username"
        class="auth-block-username"
        label="Username"
        @keydown.enter="send" />
      <v-text-field
        v-if="newAccount"
        v-model="email"
        class="auth-block-email"
        label="Email"
        @keydown.enter="send" />
      <v-text-field
        v-model="password"
        class="auth-block-password"
        type="password"
        label="Password"
        @keydown.enter="send" />
      <v-btn class="auth-block-btn" @click="send">{{
        newAccount ? "register" : "Login"
      }}</v-btn>
      <v-switch v-model="newAccount" label="New account"></v-switch>
    </CommonLoader>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth";
import AlertTypes from "~/core/models/local_alerts/LocalAlertTypes";

const authStore = useAuthStore();

const router = useRouter();

definePageMeta({
  layout: "empty",
});

const username: Ref<string> = ref("");
const email: Ref<string> = ref("");
const password: Ref<string> = ref("");

const newAccount: Ref<boolean> = ref(false);
const isLoading: Ref<boolean> = ref(false);

onMounted(() => {});

const send = async () => {
  isLoading.value = true;
  if (newAccount.value) {
    await register();
  } else {
    await login();
  }
  isLoading.value = false;
};

const login = async () => {
  try {
    const session = await authStore.login(username.value, password.value);
    if (!session?.token) {
      return;
    }
    createAlert(`Hello ${session?.username}`, AlertTypes.SUCCESS);
    await router.push("/");
  } catch (ex) {
    createAlert("Wrong username or password", AlertTypes.ERROR);
  }
};

const register = async () => {
  try {
    const session = await authStore.register(
      username.value,
      email.value,
      password.value
    );
    if (!session?.token) {
      return;
    }
    createAlert(`Registration complete, now you can login`, AlertTypes.SUCCESS);
    newAccount.value = false;
  } catch (ex) {
    createAlert("Username or Email is already taken", AlertTypes.ERROR);
  }
};
</script>

<style lang="scss" scoped>
.auth {
  height: 100dvh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &-block {
    height: 100%;
    margin-top: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    max-width: 80dvw;

    &-username {
    }

    &-email {
    }

    &-password {
    }

    &-btn {
      width: 100%;
    }
  }
}
</style>
