<template>
  <div class="header-block">
    <v-chip color="primary" class="header-block__username">
      {{ authStore.getUsername }}
    </v-chip>
    <v-chip color="primary" class="header-block__email">
      {{ authStore.getEmail }}
    </v-chip>
    <span class="header-block__logout-btn">
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </span>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth";
import { useLocalAlertsStore } from "@/store/local_alerts";
import AlertTypes from "~/models/local_alerts/LocalAlertTypes";

const authStore = useAuthStore();
const localAlertsStore = useLocalAlertsStore();

const logout = async () => {
  await authStore.logout();
  navigateTo("/auth");
  localAlertsStore.createAlert("Logout successful", AlertTypes.SUCCESS);
};
</script>

<style lang="scss" scoped>
.header-block {
  position: fixed;
  z-index: 100;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid;
  backdrop-filter: blur(10px);

  display: flex;
  justify-content: right;
  align-items: center;

  &__logout-btn {
    // padding: auto;
    height: 100%;
    float: right;
  }
}
</style>
