<template>
  <div class="auth">
    <div class="auth-block">
      <v-text-field
        v-model="username"
        class="auth-block__username"
      />
      <v-text-field
        v-model="password"
        class="auth-block__password"
        type="password"
      />
      <v-btn @click="auth">Login</v-btn>
      <!-- <v-input class="auth-block__username" />
      <v-input class="auth-block__password" type="password" /> -->

    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'empty'
})

const username: Ref<string> = ref("");
const password: Ref<string> = ref("");

onMounted(() => {});

const auth = () => {
  console.log("TEST button? LOGIN")
}
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
  }
}
</style>
