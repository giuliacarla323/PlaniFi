<template>
  <div class="mt-6 p-6 bg-[#F0FBFC] rounded-2xl shadow-md border border-[#CDEDEF]">
    <h2 class="text-xl font-bold text-[#134F5E] mb-4 flex items-center gap-2">📞 To Call Or Email</h2>

    <ul v-if="!loading" class="space-y-3">
      <li
        v-for="call in callStore.calls"
        :key="call.id"
        class="flex items-center justify-between bg-white border border-[#CDEDEF] p-3 rounded-lg shadow-sm"
      >
        <label class="flex items-center space-x-3">
          <input
            type="checkbox"
            v-model="call.is_completed"
            @change="toggleComplete(call)"
            class="accent-[#6EC0CD] w-4 h-4"
          />
          <span
            :class="{
              'line-through text-gray-400': call.is_completed,
              'text-[#134F5E]': !call.is_completed
            }"
            class="text-sm"
          >
            {{ call.text }}
          </span>
        </label>
        <div class="space-x-2">
          <button
            @click="startEdit(call)"
            class="text-[#347D99] cursor-pointer hover:text-[#135B5A] transition"
          >
            ✏️
          </button>
          <button
            @click="confirmDelete(call.id)"
            class="text-[#EF4444] cursor-pointer hover:text-red-700 transition"
          >
            🗑️
          </button>
        </div>
      </li>
    </ul>

    <p v-else class="text-[#134F5E] text-sm">Loading contacts...</p>

    <!-- Add/Edit Form -->
    <form @submit.prevent="submitForm" class="mt-6 space-y-3">
      <input
        v-model="form.text"
        placeholder="Add a contact or task..."
        class="w-full border border-[#A0DDE3] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6EC0CD] bg-white shadow-inner"
        required
      />
      <button
        class="w-full bg-[#134F5E] cursor-pointer hover:bg-[#94E9E8] text-white font-semibold px-4 py-2 rounded-lg transition shadow-md"
      >
        {{ form.id ? '💾 Save Changes' : '➕ Add Entry' }}
      </button>
    </form>

    <!-- Confirmation Modal -->
    <div
  v-if="showModal"
  class="fixed inset-0 flex items-center justify-center bg-[#CDEDEF]/40 z-50 backdrop-blur-sm"
>

      <div class="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center border border-[#CDEDEF]">
        <h3 class="text-lg font-semibold text-[#134F5E] mb-4">Are you sure?</h3>
        <p class="text-sm text-gray-600 mb-6">Do you really want to delete this entry?</p>
        <div class="flex justify-center space-x-4">
          <button
            @click="deleteConfirmed"
            class="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Yes, Delete
          </button>
          <button
            @click="cancelDelete"
            class="bg-gray-200 cursor-pointer hover:bg-gray-300 text-[#134F5E] px-4 py-2 rounded"
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
import { useCallStore } from '../../store/callStore';

const props = defineProps({
  dailyPlanId: Number
});

const callStore = useCallStore();
const loading = ref(false);

const form = ref({
  id: null,
  text: '',
  is_completed: false
});

// Modal state
const showModal = ref(false);
const itemToDelete = ref(null);

function confirmDelete(id) {
  itemToDelete.value = id;
  showModal.value = true;
}

function cancelDelete() {
  itemToDelete.value = null;
  showModal.value = false;
}

async function deleteConfirmed() {
  if (!itemToDelete.value) return;
  await callStore.removeCall(itemToDelete.value);
  itemToDelete.value = null;
  showModal.value = false;
  fetchCalls();
}

async function fetchCalls() {
  if (!props.dailyPlanId) return;
  loading.value = true;
  await callStore.loadCalls(props.dailyPlanId);
  loading.value = false;
}

async function submitForm() {
  const item = {
    text: form.value.text,
    is_completed: form.value.is_completed,
    daily_plan_id: props.dailyPlanId
  };

  if (form.value.id) {
    await callStore.editCall(form.value.id, item);
  } else {
    await callStore.saveCall(item);
  }

  resetForm();
  fetchCalls();
}

function startEdit(call) {
  form.value = { ...call };
}

async function toggleComplete(call) {
  await callStore.editCall(call.id, {
    ...call,
    is_completed: call.is_completed
  });
}

function resetForm() {
  form.value = { id: null, text: '', is_completed: false };
}

watch(
  () => props.dailyPlanId,
  (newVal) => {
    if (newVal) fetchCalls();
  },
  { immediate: true }
);
</script>
