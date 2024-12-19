<template>
  <div class="auth">
    <div class="auth-block">
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
      <v-btn class="auth-block-btn" @click="send">{{ newAccount ? 'register' : 'Login' }}</v-btn>
      <v-switch v-model="newAccount" label="New account"></v-switch>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth";
import AlertTypes from "~/core/models/local_alerts/LocalAlertTypes";

const authStore = useAuthStore();

definePageMeta({
  layout: "empty",
});

const username: Ref<string> = ref("");
const email: Ref<string> = ref("");
const password: Ref<string> = ref("");

const newAccount: Ref<boolean> = ref(false);

onMounted(() => {});

const send = async () => {
  if (newAccount.value) {
    register();
  } else {
    login();
  }
}

const login = async () => {
  try {
    const session = await authStore.login(username.value, password.value);
    if (!session?.token) {
      return;
    }
    createAlert(
      `Hello ${session?.username}`,
      AlertTypes.SUCCESS
    );
    navigateTo("/");
  } catch (ex) {
    createAlert(
      "Wrong username or password",
      AlertTypes.ERROR
    );
  }
};

const register = async () => {
  try {
    const session = await authStore.register(username.value, email.value, password.value);
    if (!session?.token) {
      return;
    }
    createAlert(
      `Registration complete, now you can login`,
      AlertTypes.SUCCESS
    );
    newAccount.value = false;
  } catch (ex) {
    createAlert(
      "Username or Email is already taken",
      AlertTypes.ERROR
    );
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
    display: block;
    // border: 1px solid blue;
    width: 200px;
    max-width: 80dvw;
    // color: white;

    &-username {
      // width: 200px;
      // max-width: 80dvw;
    }

    &-email {
      // width: 200px;
      // max-width: 80dvw;
    }

    &-password {
      // width: 200px;
      // max-width: 80dvw;
    }

    &-btn {
      width: 100%;
      // max-width: 80dvw;
    }
  }
}
</style>
