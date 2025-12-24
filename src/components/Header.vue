<template>
  <header class="app-header" role="banner" aria-label="App header">
    <div class="left">
      <div v-if="imgSrc" class="logo">
        <img :src="imgSrc" :alt="imgAlt" />
      </div>
      <h1 class="title">{{ title }}</h1>
      <p>{{ slogan }}</p>
    </div>

    <div class="right">
      <!-- optional action buttons / icons can be passed via slot -->
      <slot name="actions">
        <router-link to="/">
          <button class="home-button">Home</button>
        </router-link>
      </slot>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: "Vue Walking App" },
  slogan: {
    type: String,
    default: "Your companion for tracking walks and staying active.",
  },
  imgSrc: { type: String, default: "" },
  imgAlt: { type: String, default: "logo" },
});
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  padding: calc(env(safe-area-inset-top, 0) + 8px) 16px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #2919ff;
}
.logo img {
  height: 40px;
  width: auto;
  display: block;
  border-radius: 6px;
}

/* title styling */
.title {
  font-size: 18px;
  font-weight: 600;
  color: #f7f7f7;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* right area for actions (slot) */
.right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.home-button {
  background-color: #f7f7f7;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}
</style>
