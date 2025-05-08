<template>
  <div class="footer__section"></div>
</template>

<script setup lang="ts"></script>

<style scoped>
.footer__section {
  z-index: 100;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
  border-top: 1px solid;
  backdrop-filter: blur(10px);
}
</style>
