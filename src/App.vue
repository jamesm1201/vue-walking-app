<script setup>
import Header from "@/components/Header.vue";
</script>

<template>
  <header class="header-section">
    <Header />
  </header>

  <main class="page">
    <router-view />
  </main>
</template>

<style scoped>
/* Assuming the root element (e.g., #app) covers the viewport */
#app {
  height: 100vh; /* Use 100vh to ensure it fills the viewport height */
  display: flex;
  flex-direction: column;
  width: 100vh;
}
.header.header-section {
  width: 100%;
  height: 60px; /* Fixed height for header */
  position: fixed;
  top: 0;
}
.page {
  margin-top: 60px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: auto;
  overflow: hidden;
}

main {
  flex-grow: 1; /* Allows 'main' to take up all remaining vertical space */
  display: flex; /* Apply flex to 'main' to manage its content (Home) */
  flex-direction: column;
  height: auto; /* Since flex-grow is set, height can be auto */
  overflow: hidden; /* Prevent main from overflowing if Home content is too large */
}
</style>
