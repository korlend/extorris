<template>
  <div class="footer-block"></div>
</template>

<script setup lang="ts"></script>

<style scoped>
.footer-block {
  z-index: 10;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
  border-top: 1px solid;
  backdrop-filter: blur(10px);
}
</style>
