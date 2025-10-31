<template>
  <div>
    <h2>Minhas Tarefas</h2>
    <form @submit.prevent="createTodo" style="display:flex; gap:8px; margin-bottom:12px;">
      <label class="sr-only" for="new-title">Nova tarefa</label>
      <input id="new-title" v-model="newTitle" type="text" placeholder="Nova tarefa..." autocomplete="off" aria-label="Nova tarefa" />
      <button type="submit" aria-label="Adicionar tarefa">Adicionar</button>
    </form>
    <ul>
      <li v-for="t in todos" :key="t.id">
        <div class="todo-title">
          <input :id="`chk-${t.id}`" type="checkbox" v-model="t.completed" @change="toggleCompleted(t)" :aria-label="`Marcar ${t.title} como concluída`" />
          <input :aria-label="`Título da tarefa ${t.title}`" v-model="t.title" @change="updateTitle(t)" />
        </div>
        <div class="todo-actions">
          <button @click="removeTodo(t.id)" :aria-label="`Excluir ${t.title}`">Excluir</button>
        </div>
      </li>
    </ul>
  </div>
  <p class="small" v-if="error">Erro: {{ error }}</p>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { api } from '../services/api.js';

const todos = ref([]);
const newTitle = ref('');
const error = ref('');

async function loadTodos() {
  try {
    const res = await api.get('/todos');
    todos.value = res.data;
  } catch (e) {
    error.value = e?.response?.data?.error || e.message;
  }
}

async function createTodo() {
  if (!newTitle.value.trim()) return;
  try {
    const res = await api.post('/todos', { title: newTitle.value.trim() });
    todos.value.unshift(res.data);
    newTitle.value = '';
  } catch (e) {
    error.value = e?.response?.data?.error || e.message;
  }
}

async function updateTitle(todo) {
  try {
    const res = await api.put(`/todos/${todo.id}`, { title: todo.title });
    Object.assign(todo, res.data);
  } catch (e) {
    error.value = e?.response?.data?.error || e.message;
  }
}

async function toggleCompleted(todo) {
  try {
    const res = await api.put(`/todos/${todo.id}`, { completed: !!todo.completed });
    Object.assign(todo, res.data);
  } catch (e) {
    error.value = e?.response?.data?.error || e.message;
  }
}

async function removeTodo(id) {
  try {
    await api.delete(`/todos/${id}`);
    todos.value = todos.value.filter(t => t.id !== id);
  } catch (e) {
    error.value = e?.response?.data?.error || e.message;
  }
}

onMounted(loadTodos);
</script>

<style scoped>
input[type="text"] { flex: 1; }
</style>

