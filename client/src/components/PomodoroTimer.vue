<template>
  <div>
    <h2>Pomodoro</h2>
    <div style="display:flex; gap:8px; margin-bottom:8px;">
      <label>
        Foco (min):
        <input type="number" v-model.number="focusMinutes" min="1" />
      </label>
      <label>
        Pausa (min):
        <input type="number" v-model.number="breakMinutes" min="1" />
      </label>
      <label>
        Ciclos:
        <input type="number" v-model.number="cycles" min="1" />
      </label>
    </div>
    <div class="timer">{{ minutes.toString().padStart(2,'0') }}:{{ seconds.toString().padStart(2,'0') }}</div>
    <div class="controls">
      <button @click="start" :disabled="running">Iniciar</button>
      <button @click="pause" :disabled="!running">Pausar</button>
      <button @click="reset">Resetar</button>
      <span>{{ isBreak ? 'Pausa' : 'Foco' }} (ciclo {{ currentCycle }}/{{ cycles }})</span>
    </div>
  </div>
  <p class="small" v-if="notification">{{ notification }}</p>
</template>

<script setup>
import { onBeforeUnmount, ref, computed } from 'vue';

const focusMinutes = ref(25);
const breakMinutes = ref(5);
const cycles = ref(4);

const running = ref(false);
const isBreak = ref(false);
const currentCycle = ref(1);
const notification = ref('');

const totalMs = ref(focusMinutes.value * 60 * 1000);
const remainingMs = ref(totalMs.value);
let intervalId = null;

const minutes = computed(() => Math.floor(remainingMs.value / 60000));
const seconds = computed(() => Math.floor((remainingMs.value % 60000) / 1000));

function tick() {
  remainingMs.value -= 1000;
  if (remainingMs.value <= 0) {
    nextPhase();
  }
}

function start() {
  if (running.value) return;
  running.value = true;
  intervalId = setInterval(tick, 1000);
}

function pause() {
  running.value = false;
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
}

function reset() {
  pause();
  isBreak.value = false;
  currentCycle.value = 1;
  totalMs.value = focusMinutes.value * 60 * 1000;
  remainingMs.value = totalMs.value;
  notification.value = '';
}

function nextPhase() {
  pause();
  if (!isBreak.value) {
    // finished focus
    isBreak.value = true;
    totalMs.value = breakMinutes.value * 60 * 1000;
    remainingMs.value = totalMs.value;
    notification.value = 'Foco concluído! Pausa iniciada.';
    start();
  } else {
    // finished break
    isBreak.value = false;
    if (currentCycle.value >= cycles.value) {
      notification.value = 'Todos os ciclos concluídos! Bom trabalho!';
      reset();
    } else {
      currentCycle.value += 1;
      totalMs.value = focusMinutes.value * 60 * 1000;
      remainingMs.value = totalMs.value;
      notification.value = 'Pausa concluída! Próximo foco.';
      start();
    }
  }
}

onBeforeUnmount(() => pause());
</script>

 

<style scoped>
label { display: inline-flex; align-items: center; gap: 6px; }
input[type="number"] { padding: 6px; border-radius: 6px; border: 1px solid #ccc; background: transparent; max-width: 120px; }
</style>

