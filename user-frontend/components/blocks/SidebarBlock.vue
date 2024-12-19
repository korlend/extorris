<template>
  <div class="sidebar__block custom-scroll">
    <div class="sidebar__block-inner custom-scroll">
      <!-- <template v-for="page in getPages" :key="page.name">
        <router-link
          v-if="!page.collapsable"
          class="sidebar__block-inner-link"
          :class="getLinkClasses(page)"
          :to="page.path">
          <span>
            {{ page.name }}
          </span>
        </router-link>
        <div
          v-if="page.collapsable"
          class="sidebar__block-inner-link collapsable"
          :class="getLinkClasses(page)">
          <span>{{ page.name }}</span>
          <v-icon @click="toggleCollapsable(page)">{{
            collapsedPages[page.name] ? "mdi-minus" : "mdi-plus"
          }}</v-icon>
        </div>
      </template> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

// import { useEntitiesStore } from "@/store/entities";

interface SidebarPage {
  name: string;
  path: string;
  parentName?: string;
  collapsable?: boolean;
  nestedLevel?: number;
  hiddenByParent?: boolean;
}

// const entitiesStore = useEntitiesStore();

const collapsedPages: Ref<Record<string, boolean>> = ref({});

// onBeforeMount(() => {
//   entitiesStore.loadEntitiesList();
// });

// const entitiesList = computed(() => {
//   return entitiesStore.getEntitiesList;
// });

// const getPages = computed(() => {
//   const pages: Array<SidebarPage> = [];
//   pages.push({ name: "Main Page", path: "/" });

//   const entitiesPageName = "Entities";
//   pages.push({
//     name: entitiesPageName,
//     collapsable: true,
//     path: "",
//   });

//   const entitiesLink = "/entities";
//   for (let i = 0; i < entitiesList.value.length; i++) {
//     const entity = entitiesList.value[i];
//     pages.push({
//       name: entity,
//       path: `${entitiesLink}/${entity}`,
//       parentName: entitiesPageName,
//       nestedLevel: 1,
//       hiddenByParent: !collapsedPages.value[entitiesPageName],
//     });
//   }

//   pages.push({
//     name: "Main Map",
//     path: "/main_map/0",
//   });

//   pages.push({
//     name: "Hub 0",
//     path: "/main_map/hub/0",
//   });

//   pages.push({
//     name: "Hub test",
//     path: "/main_map/hub/test",
//   });

//   pages.push({
//     name: "Personal settings",
//     path: "/settings",
//   });
//   return pages;
// });

// const getLinkClasses = (page: SidebarPage) => {
//   const route = useRoute();
//   const classes = [];
//   if (page.path === route.path) {
//     classes.push("highlighted-link");
//   }

//   const childPages = getPagesOfParent(page);
//   for (let i = 0; i < childPages.length; i++) {
//     if (childPages[i].path === route.path) {
//       classes.push("highlighted-link");
//       break;
//     }
//   }

//   if (page.nestedLevel) {
//     classes.push("nested");
//   }

//   if (page.hiddenByParent) {
//     classes.push("hidden");
//   }
//   return classes;
// };

const toggleCollapsable = (page: SidebarPage) => {
  collapsedPages.value[page.name] = !collapsedPages.value[page.name];
};

// const getPagesOfParent = (parent: SidebarPage) => {
//   const pages = [];
//   for (let i = 0; i < getPages.value.length; i++) {
//     const page = getPages.value[i];
//     if (page.parentName === parent.name) {
//       pages.push(page);
//     }
//   }
//   return pages;
// };
</script>

<style lang="scss" scoped>
.sidebar__block {
  position: sticky;
  z-index: 100;
  width: 200px;
  backdrop-filter: blur(10px);

  &-inner {
    // position: absolute;
    overflow: auto;
    // top: 50px;
    left: 0px;
    z-index: 20;
    width: 200px;
    height: calc(100dvh - 50px);
    border-right: solid 1px;

    &-link {
      width: 100%;
      height: 40px;
      padding: 0 10px;
      line-height: 40px;
      display: block;
      text-decoration: none;
      font-weight: 400;
      overflow: hidden;
      color: white;

      transition: height 0.5s;

      &:hover {
        background-color: #888888;
        font-weight: 700;
      }

      &.highlighted-link {
        background-color: #5e65e0;
      }

      &.nested {
        padding: 0 10px 0 20px;
      }

      &.collapsable {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &:hover {
          background-color: #777777;
          font-weight: 400;
        }
      }

      &.hidden {
        height: 0px;
      }
    }
  }
}
</style>
