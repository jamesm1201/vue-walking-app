<template>
  <div class="home-container">
    <div class="search-section">
      <router-link to="/add-walk">
        <button>Add a New Walk</button>
      </router-link>
    </div>
    <div class="featured-walk-section">
      <FeaturedWalk
        :center="mapCenter"
        :walkPath="walkCoordinates"
        :walkData="featuredWalkData"
      />
    </div>
  </div>
</template>

<script setup>
import FeaturedWalk from "@/components/FeaturedWalk.vue";
import featuredWalkData from "@/data/walks/featured_walk.json";
import { computed } from "vue";

const walkCoordinates = computed(() => {
  // Search features array in imported data for LineString geometry
  const lineFeature = featuredWalkData.features.find(
    (f) => f.geometry.type === "LineString"
  );
  return lineFeature ? lineFeature.geometry.coordinates : [];
});

const mapCenter = computed(() => {
  return walkCoordinates.value.length > 0
    ? walkCoordinates.value[0]
    : [-1.28414, 51.3828]; // Default fallback center
});
</script>

<style scoped>
.home-container {
  /*Home needs to fill the height of its parent (<main>) */
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column; /* Stacks the children vertically */
}
.search-section {
  height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
}
.featured-walk-section {
  /* flex-grow: 1;  */
  /* Takes up remaining space */
  width: 100%;
  margin-top: 20px;
  height: 50vh;
}
</style>
