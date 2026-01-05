<template></template>

<script setup>
import mapboxgl from "mapbox-gl";
import markerIcon from "@/assets/icons/marker-pin.svg";
import cafeIcon from "@/assets/icons/cafe-pin.svg";
import viewpointIcon from "@/assets/icons/view-pin.svg";
import parkingIcon from "@/assets/icons/parking-pin.svg";
import { watch, onUnmounted } from "vue";

const iconMap = {
  cafe: cafeIcon,
  viewpoint: viewpointIcon,
  parking: parkingIcon,
  other: markerIcon, // your default marker
};

const props = defineProps({
  map: Object,
  coordinates: {
    type: Array,
    required: true,
  },
  poiData: {
    type: Object,
    default: () => ({type: "other"}),
  },
});

const icon = props.poiData?.type 
  ? (iconMap[props.poiData.type] || markerIcon)
  : markerIcon;
let marker = null;

watch(
  () => props.map,
  (newMap) => {
    // Map must be ready
    if (!newMap || typeof newMap.addControl !== "function") return;

    // Coordinates must exist
    if (!props.coordinates) return;

    // Remove old marker if it exists
    if (marker) marker.remove();

    // Create DOM element
    const el = document.createElement("div");
    el.className = "poi-marker";
    // Set differently depending on type
    el.style.backgroundImage = `url("${icon}")`;

    // Create marker
    marker = new mapboxgl.Marker({ element: el })
      .setLngLat(props.coordinates)
      .addTo(newMap);

    // Popup (if provided)
    if (props.poiData?.name) {
      const popupContent = `
        <div>
          <h3>${props.poiData.name}</h3>
          <p>${props.poiData.description || ""}</p>
        </div>
      `;

      marker.setPopup(
        new mapboxgl.Popup({
          offset: 25,
          className: "poi-popup",
        }).setHTML(popupContent)
      );
    }
  },
  { immediate: true }
);
onUnmounted(() => {
  if (marker) marker.remove();
});
</script>

<style>
.poi-marker {
  width: 32px;
  height: 32px;
  display: block;
  cursor: pointer;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.poi-popup .mapboxgl-popup-content {
  color: white; /* changes text color */
  background-color: #2c3e50; /* optional background */
}

.poi-popup .mapboxgl-popup-content h3 {
  color: #f1c40f;
}

.poi-popup .mapboxgl-popup-content p {
  color: #ecf0f1;
}
</style>
