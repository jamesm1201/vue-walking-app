<template>
  <div class="walk-details-form" :class="{ disabled: walkPath === null }">
    <h2 class="walk-form-group">Walk Details</h2>
    <form @submit.prevent="saveWalk">
      <div class="walk-form-group">
        <label for="walk-name">Walk Name *</label>
        <input
          id="walk-name"
          v-model="walkDetailsFormData.name"
          type="text"
          placeholder="e.g. Park Lap"
          required
        />
      </div>
      <div class="walk-form-group">
        <label>Difficulty *</label>
        <div class="radio-group">
          <label class="radio-option">
            <input
              type="radio"
              v-model="walkDetailsFormData.difficulty"
              value="easy"
              required
            />
            <span>Rambler</span>
          </label>
          <label class="radio-option">
            <input
              type="radio"
              v-model="walkDetailsFormData.difficulty"
              value="medium"
            />
            <span>Hiker</span>
          </label>
          <label class="radio-option">
            <input
              type="radio"
              v-model="walkDetailsFormData.difficulty"
              value="hard"
            />
            <span>Mountain Goat</span>
          </label>
        </div>
      </div>
      <div class="walk-form-group">
        <label for="walk-duration">Estimated Duration *</label>
        <select id="walk-duration" v-model="walkDetailsFormData.estimatedDuration" required>
          <!-- Initial value cannot see after another is selected-->
          <option value="" hidden>...</option>
          <option value="half">30 mins</option>
          <option value="hour">An Hour</option>
          <option value="two">Two Hours</option>
          <option value="three">Three Hours+</option>
        </select>
      </div>
      <div class="walk-form-group">
        <label for="walk-description">Description</label>
        <textarea
          id="walk-description"
          v-model="walkDetailsFormData.description"
          rows="3"
        ></textarea>
      </div>

      <div class="walk-form-button">
        <button type="submit" :disabled="!canSave">Save Walk</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
const walkDetailsFormData = ref({
  name: "",
  difficulty: "",
  estimatedDuration: "",
  description: "",
  walkType: "",
  dogFriendly: "",
  footwear: "",
  pramFriendly: "",
  parking: "",
  season: [],
});
// Can save is computed based on walkPath and form validity
const canSave = computed(() => {
  return (
    walkDetailsFormData.value.name.trim() !== "" &&
    walkDetailsFormData.value.difficulty !== ""
  );
});
// What events this component emits
const emit = defineEmits(['save']);
// when form is submitted emit save event with form data
function saveWalk() {
  emit('save', walkDetailsFormData.value);
}
</script>

<style scoped>
.walk-details-form {
  width: 90%;
  max-width: 800px;
  margin: 10px;
  padding: 30px;
  border: 2px solid #e0e0e0;
  background: white;
  padding: 30px;
  align-self: center;
  border-radius: 8px;
}

.walk-details-form.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.walk-form-group {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: #5f2fcf;
}

.walk-form-group label {
  min-width: 150px;
  font-weight: bold;
}

.walk-form-group input,
.walk-form-group select,
.walk-form-group textarea {
  flex: 1;
  padding: 8px;
  border: 1px solid #5f2fcf;
  border-radius: 4px;
}

.radio-group {
  display: flex;
  gap: 15px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.radio-option input[type="radio"] {
  cursor: pointer;
}

.walk-form-button {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.walk-form-button button {
  padding: 12px 30px;
  background: #5f2fcf;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.walk-form-button button:hover:not(:disabled) {
  background: #4a24a3;
}

.walk-form-button button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
