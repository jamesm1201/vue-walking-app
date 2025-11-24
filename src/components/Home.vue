<template>
    <section class="home">
        <header class="home__header">
            <h1 class="home__title">Home</h1>
            <p class="home__subtitle">Welcome to the walking app — quick start</p>
        </header>

        <main class="home__main">
            <div class="home__controls">
                <button @click="toggleWalking" :class="{'is-walking': isWalking}">
                    {{ isWalking ? 'Stop Walk' : 'Start Walk' }}
                </button>

                <div class="home__stats">
                    <div class="stat">
                        <label>Steps</label>
                        <div class="value">{{ steps }}</div>
                    </div>
                    <div class="stat">
                        <label>Duration</label>
                        <div class="value">{{ formattedDuration }}</div>
                    </div>
                </div>
            </div>

            <!-- Placeholder for a map or route preview -->
            <div class="home__map" aria-hidden="true">
                <p>Map / Route preview</p>
            </div>
        </main>

        <footer class="home__footer">
            <small>Tip: Allow location access to record real walks</small>
        </footer>
    </section>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const isWalking = ref(false)
const steps = ref(0)
const duration = ref(0) // seconds

let timer = null

function toggleWalking() {
    if (isWalking.value) stopWalk()
    else startWalk()
}

function startWalk() {
    isWalking.value = true
    // simple simulated step/duration increment for skeleton
    timer = setInterval(() => {
        steps.value += Math.floor(Math.random() * 3) // simulate 0-2 steps per tick
        duration.value += 1
    }, 1000)
}

function stopWalk() {
    isWalking.value = false
    if (timer) {
        clearInterval(timer)
        timer = null
    }
}

onUnmounted(() => {
    if (timer) clearInterval(timer)
})

const formattedDuration = computed(() => {
    const mins = Math.floor(duration.value / 60)
    const secs = duration.value % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})
</script>

<style scoped>
.home {
    max-width: 920px;
    margin: 24px auto;
    padding: 16px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    color: #222;
}

.home__header {
    margin-bottom: 12px;
}

.home__title {
    margin: 0;
    font-size: 1.5rem;
}

.home__subtitle {
    margin: 4px 0 0;
    color: #555;
    font-size: 0.95rem;
}

.home__main {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 16px;
    align-items: start;
}

.home__controls {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

button {
    padding: 10px 14px;
    border: none;
    background: #0078d4;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}

button.is-walking {
    background: #d9534f;
}

.home__stats {
    display: flex;
    gap: 12px;
}

.stat {
    background: #f5f5f5;
    padding: 8px 12px;
    border-radius: 6px;
    min-width: 96px;
    text-align: center;
}

.stat label {
    display: block;
    font-size: 0.8rem;
    color: #666;
}

.stat .value {
    font-size: 1.15rem;
    font-weight: 700;
    margin-top: 4px;
}

.home__map {
    background: linear-gradient(180deg,#eef4ff,#fff);
    border: 1px dashed #cfd8e3;
    height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #7a8596;
    border-radius: 8px;
}

.home__footer {
    margin-top: 16px;
    text-align: center;
    color: #666;
    font-size: 0.85rem;
    grid-column: 1 / -1;
}
</style>