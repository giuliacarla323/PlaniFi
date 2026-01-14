<template>
  <div class="mt-6 p-6 bg-[#F0FBFC] rounded-2xl shadow-md border border-[#CDEDEF]">
    <h2 class="text-xl font-bold text-[#134F5E] mb-4 flex items-center gap-2">✅ To-Do List</h2>

    <ul v-if="!loading" class="space-y-3">
      <li
        v-for="todo in todoStore.todos"
        :key="todo.id"
        class="flex items-center justify-between bg-white border border-[#CDEDEF] p-3 rounded-lg shadow-sm"
      >
        <label class="flex items-center space-x-3">
          <input
            type="checkbox"
            v-model="todo.is_completed"
            @change="toggleComplete(todo)"
            class="accent-[#6EC0CD] w-4 h-4"
          />
          <span
            :class="{
              'line-through text-gray-400': todo.is_completed,
              'text-[#134F5E]': !todo.is_completed
            }"
            class="text-sm"
          >
            {{ todo.task }}
          </span>
        </label>
        <div class="space-x-2">
          <button
            @click="startEdit(todo)"
            class="text-[#347D99] hover:text-[#135B5A] transition cursor-pointer"
          >
            ✏️
          </button>
          <button
            @click="removeTodo(todo.id)"
            class="text-[#EF4444] hover:text-red-700 transition cursor-pointer"
          >
            🗑️
          </button>
        </div>
      </li>
    </ul>

    <p v-else class="text-[#134F5E] text-sm">Loading tasks...</p>

    <!-- Add/Edit Form -->
    <form @submit.prevent="submitForm" class="mt-6 space-y-3">
      <input
        v-model="form.task"
        placeholder="Add a task..."
        class="w-full border border-[#A0DDE3] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6EC0CD] bg-white shadow-inner"
        required
      />
      <button
        class="w-full bg-[#134F5E] cursor-pointer hover:bg-[#94E9E8] text-white font-semibold px-4 py-2 rounded-lg transition shadow-md"
      >
        {{ form.id ? '💾 Save Changes' : '➕ Add Task' }}
      </button>
    </form>
    <!-- Delete Confirmation Modal -->
<div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-[#CDEDEF]/40 backdrop-blur-sm z-50">
  <div class="bg-white rounded-xl p-6 shadow-lg w-[90%] max-w-md text-center">
    <h3 class="text-lg font-semibold text-[#134F5E] mb-4">Are you sure you want to delete this task?</h3>
    <div class="flex justify-center gap-4">
      <button
        @click="confirmDelete"
        class="bg-[#EF4444] cursor-pointer hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition"
      >
        Yes, delete
      </button>
      <button
        @click="cancelDelete"
        class="bg-[#6EC0CD] cursor-pointer hover:bg-[#94E9E8] text-white px-4 py-2 rounded-lg shadow transition"
      >
        Cancel
      </button>
    </div>
  </div>
</div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useTodoStore } from '../../store/todoStore';

const props = defineProps({
  dailyPlanId: Number
});

const todoStore = useTodoStore();
const loading = ref(false);

const form = ref({
  id: null,
  task: '',
  is_completed: false
});

async function fetchTodos() {
  if (!props.dailyPlanId) return;
  loading.value = true;
  await todoStore.loadTodos(props.dailyPlanId);
  loading.value = false;
}

async function submitForm() {
  const item = {
    task: form.value.task,
    is_completed: form.value.is_completed,
    daily_plan_id: props.dailyPlanId
  };

  if (form.value.id) {
    await todoStore.editTodo(form.value.id, item);
  } else {
    await todoStore.saveTodo(item);
  }

  resetForm();
  fetchTodos();
}

function startEdit(todo) {
  form.value = { ...todo };
}

async function toggleComplete(todo) {
  await todoStore.editTodo(todo.id, {
    ...todo,
    is_completed: todo.is_completed
  });
}

const showModal = ref(false);
const taskToDelete = ref(null);

function removeTodo(id) {
  taskToDelete.value = id;
  showModal.value = true;
}

async function confirmDelete() {
  if (taskToDelete.value) {
    await todoStore.removeTodo(taskToDelete.value);
    fetchTodos();
  }
  showModal.value = false;
  taskToDelete.value = null;
}

function cancelDelete() {
  showModal.value = false;
  taskToDelete.value = null;
}


function resetForm() {
  form.value = { id: null, task: '', is_completed: false };
}

watch(
  () => props.dailyPlanId,
  (newVal) => {
    if (newVal) fetchTodos();
  },
  { immediate: true }
);

</script>
