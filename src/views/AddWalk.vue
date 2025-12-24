<template>
  <div class="map-container">
    <div ref="mapContainer" class="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const mapContainer = ref(null);
const map = ref(null);
mapboxgl.accessToken =
  "pk.eyJ1IjoiamFtZXNtMTIwMSIsImEiOiJjbTM1empmbHowMDN3MmxxcTFhd2V6ZnUwIn0.371lKfhPVCbb9V-ZKG4MwA";

onMounted(() => {
  try {
    map.value = new mapboxgl.Map({
      container: mapContainer.value,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [-1.28414, 51.3828],
      zoom: 12,
      pitch: 45,
      bearing: 0,
    });

    map.value.on("load", () => {
      // Add navigation controls to the map (zoom and rotation)
      map.value.addControl(
        new mapboxgl.NavigationControl({
          showCompass: true,
          showZoom: true,
          visualizePitch: true,
        }),
        "top-right"
      );
      // Add scale control
      map.value.addControl(
        new mapboxgl.ScaleControl({ maxWidth: 100, unit: "metric" }),
        "bottom-left"
      );
    });
  } catch (error) {
    console.error("Error initializing Mapbox map:", error);
  }
});

// Add navigation controls to the map (zoom and rotation)
map.value.addControl(
  new mapboxgl.NavigationControl({
    showCompass: true,
    showZoom: true,
    visualizePitch: true,
  }),
  "top-right"
);

// Add scale control
map.value.addControl(
  new mapboxgl.ScaleControl({ maxWidth: 100, unit: "metric" }),
  "bottom-left"
);

// Clean up on unmount
onUnmounted(() => {
  if (map.value) map.value.remove();
});
</script>

<style scoped>
.map-container {
  width: 100vw;
  height: 75vh;
  position: relative;
}
.map {
  width: 100%;
  height: 100%;
}
</style>
