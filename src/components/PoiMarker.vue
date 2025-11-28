<template>
  <!-- <div class="poi-container">
    <h2>Point of Interest</h2>
  </div> -->
</template>

<script setup>
import mapboxgl from "mapbox-gl";
import { onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
  map: Object,
  coordinates: {
    type: Array,
    required: true,
  },
  poiData: Object,
});

let marker;

watch(
  () => props.map,
  (newMap) => {
    // Check if newMap is defined and has the expected Mapbox methods (e.g., addControl)
    if (newMap && typeof newMap.addControl === "function") {
      const el = document.createElement("div");
      el.className = "poi-marker";
      if (marker) marker.remove();

      el.style.width = "30px";
      el.style.height = "30px";
      el.style.backgroundColor = "red"; // Should be unmistakable
      el.style.borderRadius = "50%";
      el.style.border = "4px solid yellow";
      el.style.zIndex = "1000"; // Ensure it's above all map tiles

      marker = new mapboxgl.Marker({ element: el })
        .setLngLat(coordinates)
        .addTo(newMap);

      const poiName = props.poiData.name;
      const poiDescription = props.poiData.description;

      if (poiName) {
        const popupContent = `
          <div class="poi-popup">
            <h3>${poiName}</h3>
            <p>${poiDescription}</p>
          </div>
        `;

        marker.setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent)
        );
      }
    }
  },
  { immediate: true }
);
onUnmounted(() => {
  if (marker) {
    marker.remove();
  }
});
</script>

<style scoped>
.poi-marker {
  display: block;
  width: 20px;
  height: 20px;
  background-color: #06bf00;
  border-radius: 50%;
  border: 2px solid white;
}
</style>
