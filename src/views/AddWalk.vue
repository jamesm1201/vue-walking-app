<template>
  <div class="controls">
    <button @click="toggleDrawing" :disabled="walkPath !== null && !isDrawing">
      {{ isDrawing ? "Stop Drawing" : "Start Drawing" }}
    </button>
  </div>
  <div class="map-container">
    <div ref="mapContainer" class="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const mapContainer = ref(null);
const map = ref(null);
const isDrawing = ref(false);
const draw = ref(null);
const walkPath = ref(null); // stores the line data
mapboxgl.accessToken =
  "pk.eyJ1IjoiamFtZXNtMTIwMSIsImEiOiJjbTM1empmbHowMDN3MmxxcTFhd2V6ZnUwIn0.371lKfhPVCbb9V-ZKG4MwA";

onMounted(() => {
  try {
    map.value = new mapboxgl.Map({
      container: mapContainer.value,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [-1.28414, 51.3828],
      zoom: 12,
      pitch: 35,
      bearing: 0,
    });

    map.value.on("load", () => {
      // Add navigation controls to the map (zoom and rotation)
      draw.value = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          trash: true,
          //line_string: true,
          point: true,
        },
        defaultMode: "simple_select",
      });

      // Add Draw control to the map
      map.value.addControl(draw.value, "top-left");
      map.value.addControl(
        new mapboxgl.NavigationControl({
          showCompass: true,
          showZoom: true,
          visualizePitch: true,
        }),
        "bottom-right"
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

// Clean up on unmount
onUnmounted(() => {
  if (map.value) map.value.remove();
});

function toggleDrawing() {
  // Prevent starting a new drawing if one already exists
  if (walkPath.value && !isDrawing.value) {
    console.log("A walk path already exists. Delete it first.");
    return;
  }
  isDrawing.value = !isDrawing.value;

  if (isDrawing.value) {
    draw.value.changeMode("draw_line_string");
  } else {
    // Get the data
    const data = draw.value.getAll();
    if (data.features.length > 0) {
      walkPath.value = data.features[0];
    }
    draw.value.changeMode("simple_select");
  }
}
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
.controls {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}
.controls button {
  background-color: #2919ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.controls button:disabled {
  background-color: #888;
  cursor: not-allowed;
}
</style>
