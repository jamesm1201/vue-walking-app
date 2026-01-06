<template>
  <div class="controls">
    <button @click="toggleDrawing" :disabled="walkPath !== null && !isDrawing">
      {{ isDrawing ? "Stop Drawing" : "Start Drawing" }}
    </button>
    <button @click="deleteWalkPath" :disabled="walkPath === null">
      Delete Walk
    </button>
    <button @click="togglePOIMode" :disabled="isDrawing">
      {{ isPlacingPOI ? "Cancel POI" : "Add POI" }}
    </button>
  </div>
  <div class="map-container">
    <div ref="mapContainer" class="map">
      <!-- Render POI components -->
      <POIMarker
        v-for="poi in pois"
        :key="poi.id"
        :map="map"
        :coordinates="poi.coordinates"
        :poi-data="poi"
      />
    </div>
    <div v-if="showPOIForm" class="form-modal">
      <form @submit.prevent="handleSubmit">
        <h2 class="form-group">Add Point of Interest</h2>
        <div class="form-group">
          <label for="poi-name">Name</label>
          <input id="poi-name" v-model="poiFormData.name" type="text" required />
        </div>

        <div class="form-group">
          <label for="poi-description">Description</label>
          <textarea
            id="poi-description"
            v-model="poiFormData.description"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="poi-type">Type</label>
          <select id="poi-type" v-model="poiFormData.type" required>
            <!-- Initial value cannot see after another is selected-->
            <option value="" hidden>Select type...</option>
            <option value="cafe">Cafe</option>
            <option value="viewpoint">Viewpoint</option>
            <option value="parking">Parking</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-buttons">
          <button type="submit">Save</button>
          <button type="button" @click="showPOIForm = false">Cancel</button>
        </div>
      </form>
    </div>
  </div>
  <AddWalkForm @save="handleSaveWalk"/>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import POIMarker from "@/components/PoiMarker.vue";
import AddWalkForm from "@/components/addWalkForm.vue";

const mapContainer = ref(null);
const map = ref(null);
const isDrawing = ref(false);
const draw = ref(null); // Mapbox Draw instance
const walkPath = ref(null); // Stores the line data
const isPlacingPOI = ref(false);
const pois = ref([]); // Array to store POI data
const showPOIForm = ref(false); // Control POI form visibility
const poiFormData = ref({
  name: "",
  description: "",
  type: "",
});
const currentPOICoordinates = ref(null); // Store coordinates temporarily

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
          // Made own buttons for these
          //trash: true,
          //line_string: true,
          //point: true,
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
  if (walkPath.value && !isDrawing.value) {
    console.log("A walk path already exists. Delete it first.");
    return;
  }
  isDrawing.value = !isDrawing.value;

  if (isDrawing.value) {
    draw.value.changeMode("draw_line_string");
  } else {
    const data = draw.value.getAll();
    if (data.features.length > 0) {
      walkPath.value = data.features[0];
    }
    draw.value.changeMode("simple_select");
  }
}

function togglePOIMode() {
  isPlacingPOI.value = !isPlacingPOI.value;
  // Not using mapbox draw for POI placement, so handle manually
  if (isPlacingPOI.value) {
    // Enable POI placement mode
    // Targets map instance, gets html <canvas> element and changes cursor style
    map.value.getCanvas().style.cursor = "crosshair";
    // .on() is Mapbox library for map specific events
    // JS version is addEventListener
    map.value.on("click", handleMapClickForPOI);
  } else {
    // Disable POI placement mode
    map.value.getCanvas().style.cursor = "";
    map.value.off("click", handleMapClickForPOI);
  }
}

function handleSubmit() {
  // Add POI with form data
  pois.value.push({
    // Adds ID and coordinates needed for POIMarker.vue
    id: Date.now(),
    coordinates: currentPOICoordinates.value,
    //Spreads formData fields into the new object for the Popup
    ...poiFormData.value,
  });

  // Reset form and close
  poiFormData.value = { name: "", description: "", type: "" };
  showPOIForm.value = false;
}

function handleMapClickForPOI(e) {
  // When point clicked on map, store coordinates and give to form
  currentPOICoordinates.value = [e.lngLat.lng, e.lngLat.lat];
  showPOIForm.value = true;
  // Exit POI mode after placing
  togglePOIMode();
}

function deleteWalkPath() {
  if (walkPath.value) {
    // draw.value.delete(walkPath.value.id);
    draw.value.deleteAll(); // Delete all features in Mapbox Draw instance
    walkPath.value = null; // Clear line data
    isDrawing.value = false;

    // Delete POIs when deleting walk path?
    //pois.value.forEach(poi => poi.marker.remove());
    //pois.value = [];
  }
}

function handleSaveWalk(walkData) {
  console.log("Walk data received from form:", walkData);
  // Combine form data in walk with POIs and walkPath
  // Then can send to API or store locally
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
.form-modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(104, 38, 228, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.form-modal form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
}

.form-modal h2 {
  margin: 0 0 20px 0;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  color: #5f2fcf;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.form-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.form-buttons button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.form-buttons button[type="submit"] {
  background: #5f2fcf;
  color: white;
}

.form-buttons button[type="button"] {
  background: #ccc;
}
</style>
