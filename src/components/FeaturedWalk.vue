<template>
  <div ref="mapContainer" class="map-container">
    <template v-if="map">
      <PoiMarker
        v-for="(poi, index) in poiFeatures"
        :key="index"
        :map="map"
        :coordinates="poi.geometry.coordinates"
        :poiData="poi.properties"
      />
    </template>
  </div>
</template>

<script setup>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import PoiMarker from "@/components/PoiMarker.vue";
mapboxgl.accessToken =
  "pk.eyJ1IjoiamFtZXNtMTIwMSIsImEiOiJjbTM1empmbHowMDN3MmxxcTFhd2V6ZnUwIn0.371lKfhPVCbb9V-ZKG4MwA";

const props = defineProps({
  center: {
    type: Array,
    // default: () => [-1.28414, 51.3828],
  },
  zoom: {
    type: Number,
    default: 14,
  },
  walkPath: {
    type: Array,
    default: () => [],
  },
  walkData: {
    type: Object,
    default: () => ({ features: [] }),
  },
});

// DOM element reference
const mapContainer = ref(null);
// map instance reference
const map = ref(null);
const SOURCE_ID = "walk-data";
const LAYER_ID = "walk-path-layer";

function addWalkPath() {
  // Exit if map isn't ready or no path data exists
  if (!map.value || !map.value.isStyleLoaded() || !props.walkPath.length)
    return;

  const geoJsonSource = {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: props.walkPath,
      },
    },
  };

  if (map.value.getSource(SOURCE_ID)) {
    // If source exists, just update the data
    map.value.getSource(SOURCE_ID).setData(geoJsonSource.data);
  } else {
    // Otherwise, add the source and the layer
    map.value.addSource(SOURCE_ID, geoJsonSource);

    map.value.addLayer({
      id: LAYER_ID,
      type: "line",
      source: SOURCE_ID,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#4264fb",
        "line-width": 6,
      },
    });
  }
}
onMounted(() => {
  map.value = new mapboxgl.Map({
    container: mapContainer.value,
    style: "mapbox://styles/mapbox/standard",
    zoom: props.zoom,
    center: props.center,
  });
  map.value.on("load", () => {
    addWalkPath();
  });
});
watch(
  () => props.walkPath,
  () => {
    // Only try to draw if the map is initialized and the style is ready
    if (map.value && map.value.isStyleLoaded()) {
      addWalkPath();
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  if (map.value) {
    map.value.remove();
    map.value = null;
  }
});

const poiFeatures = computed(() => {
  if (!props.walkData.features) {
    return [];
  }
  console.log(
    "walkData features:",
    props.walkData.features.filter(
      (feature) => feature.geometry && feature.geometry.type === "Point"
    )
  );
  // console.log(
  //   "walkData features:",
  //   walkData.features.filter(
  //     (feature) => feature.geometry && feature.geometry.type === "Point"
  //   )
  // );

  // Filter for features that are of type 'Point'
  return props.walkData.features.filter(
    (feature) => feature.geometry && feature.geometry.type === "Point"
  );
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}
</style>
