<template>
  <div class="auth">
    <div class="auth-block">
      <v-text-field
        v-model="username"
        class="auth-block__username"
        @keydown.enter="auth" />
      <v-text-field
        v-model="password"
        class="auth-block__password"
        type="password"
        @keydown.enter="auth" />
      <v-btn class="auth-block__btn" @click="auth">Login</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth";
import { useLocalAlertsStore } from "@/store/local_alerts";
import AlertTypes from "~/models/local_alerts/LocalAlertTypes";

const authStore = useAuthStore();
const localAlertsStore = useLocalAlertsStore();

definePageMeta({
  layout: "empty",
});

const username: Ref<string> = ref("");
const password: Ref<string> = ref("");

const dataResult: Ref<string> = ref("");

onMounted(() => {});

const auth = async () => {
  try {
    dataResult.value = await authStore.login(username.value, password.value);
    localAlertsStore.createAlert(
      `Hello ${authStore.getUsername}`,
      AlertTypes.ERROR
    );
    navigateTo("/");
  } catch (ex) {
    localAlertsStore.createAlert(
      "Wrong username or password",
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

    &__username {
      // width: 200px;
      // max-width: 80dvw;
    }

    &__password {
      // width: 200px;
      // max-width: 80dvw;
    }

    &__btn {
      width: 100%;
      // max-width: 80dvw;
    }
  }
}
</style>
