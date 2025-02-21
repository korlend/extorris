<template>
  <div class="header__block">
    <div class="header__block-links">
      <router-link
        class="header__block-links-link"
        :class="{ active: routeName === 'index' }"
        to="/"
        >My Island</router-link
      >
      <router-link
        class="header__block-links-link"
        :class="{ active: routeName === 'map' }"
        to="/map"
        >Map</router-link
      >
      <router-link
        class="header__block-links-link"
        :class="{ active: routeName === 'hub-id' }"
        to="/hub"
        >Hub</router-link
      >
      <router-link
        class="header__block-links-link"
        :class="{ active: routeName === 'test' }"
        to="/test"
        >test</router-link
      >
    </div>
    <div class="header__block-auth">
      <client-only>
        <v-btn @click="testbtn">test</v-btn>
        <v-chip color="primary" class="header__block-username">
          {{ session.username }}
        </v-chip>
        <v-chip color="primary" class="header__block-email">
          {{ session.email }}
        </v-chip>
        <span class="header__block-auth-logout__btn">
          <v-btn icon @click="logout">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </span>
      </client-only>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth";
import { useLocalAlertsStore } from "@/store/local_alerts";
import AlertTypes from "~/core/models/local_alerts/LocalAlertTypes";

const authStore = useAuthStore();
const localAlertsStore = useLocalAlertsStore();

const route = useRoute();

const session = computed(() => {
  return authStore.getSession;
});

const routeName = computed(() => {
  return route.name;
})

const logout = async () => {
  await authStore.logout();
  navigateTo("/auth");
  localAlertsStore.createAlert("Logout successful", AlertTypes.SUCCESS);
};

const testbtn = () => {
  openModalWindow({});
};
</script>

<style lang="scss" scoped>
@use "sass:map" as map;
@use "~/assets/styles/variables" as vars;

.header__block {
  position: fixed;
  z-index: map.get(vars.$z-indices, "header");
  width: 100%;
  height: 50px;
  border-bottom: 1px solid;
  backdrop-filter: blur(10px);

  display: flex;
  justify-content: space-between;

  &-links {
    display: flex;
    justify-content: left;
    align-items: center;

    & > * {
      padding: 0 10px;
    }

    &-link {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      text-decoration: none;
      color: white;

      &.active {
        color: lightblue;
      }

      &:hover {
        background-color: darkblue;
      }
    }
  }

  &-auth {
    display: flex;
    justify-content: right;
    align-items: center;

    &-logout__btn {
      // padding: auto;
      height: 100%;
      float: right;
    }
  }
}
</style>
