<template>
  <div class="container">
    <h1>Todo + Pomodoro</h1>
    <div class="row">
      <div class="col card">
        <PomodoroTimer />
      </div>
      <div class="col card">
        <TodoList />
      </div>
    </div>
  </div>
  <p class="container small">Backend: <code>{{ apiBase }}</code></p>
  <p class="container small">Dica: defina CLIENT_ORIGIN e PORT no servidor.</p>
</template>

<script setup>
import PomodoroTimer from './components/PomodoroTimer.vue';
import TodoList from './components/TodoList.vue';

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
</script>

<style scoped>
h1 { margin: 16px 0; }
</style>

