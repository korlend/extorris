<template>
  <div class="sidebar-block">
    <div class="sidebar-block__inner">
      <router-link
        v-for="page in pages"
        :key="page.name"
        class="sidebar-block__inner-link"
        :class="getLinkClasses(page)"
        :to="page.path"
      >
        {{ page.name }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const pages: Array<{ name: string; path: string }> = [
  { name: "main", path: "/" },
  {
    name: "test",
    path: "/test",
  },
];

const getLinkClasses = (page: { name: string; path: string }) => {
  const route = useRoute();
  if (page.path === route.path) {
    return ['highlighted-link'];
  }
}
</script>

<style lang="scss" scoped>
.highlighted-link {
  background-color: #5e65e0;
}

.sidebar-block {
  position: relative;
  width: 200px;
  height: 100dvh;

  &__inner {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 20;
    width: 200px;
    height: 100dvh;
    border-right: solid 1px white;
    background: #000000;

    &-link {
      width: 100%;
      height: 40px;
      padding: 0 10px;
      line-height: 40px;
      color: white;
      display: block;
      text-decoration: none;

      &:hover {
        background-color: #777777;
        font-weight: 700;
      }
    }
  }
}
</style>
