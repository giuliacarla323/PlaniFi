<template>
  <div class="relative mt-6 p-6 bg-[#F0FBFC] rounded-2xl shadow-md border border-[#CDEDEF]">
    <!-- Titlu + Buton Adăugare -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="font-bold text-xl text-[#134F5E]">📅 Daily Schedule</h2>
      <button
        @click="showForm = true"
        class="bg-[#134F5E] hover:bg-[#94E9E8] text-white font-bold px-4 py-2 rounded-lg shadow-md transition cursor-pointer"
      >
        + Add
      </button>
    </div>

    <!-- Calendarul vertical -->
    <div class="relative border-t border-b h-[1440px] bg-white rounded-lg overflow-hidden">
      <div
        v-for="hour in 24"
        :key="hour"
        class="border-b border-gray-100 h-[60px] text-sm text-gray-500 relative pl-14"
      >
        <div class="absolute left-0 top-1 text-right w-12 pr-2 font-mono text-gray-400">
          {{ (hour - 1).toString().padStart(2, '0') }}:00
        </div>
      </div>

      <!-- Evenimente plasate -->
      <div
        v-for="item in scheduleItems"
        :key="item.id"
        :style="getItemStyle(item.hour)"
        class="absolute left-16 right-4 bg-[#134F5E] hover:bg-[#94E9E8] text-white p-3 rounded-lg shadow-md text-sm transition cursor-pointer"
        @click="openDetails(item)"
      >
        <div class="font-semibold">{{ item.title }}</div>
        <div class="text-xs text-white/90 truncate">{{ item.description }}</div>
        <span v-if="item.is_important" class="text-[#ead23a] font-bold">⚠️ Important</span>
      </div>
    </div>

    <!-- MODAL Detalii Eveniment -->
    <div v-if="selectedItem" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full relative border border-[#E1F5F6]">
        <button @click="closeDetails" class="absolute top-2 right-2 text-gray-500 hover:text-black text-xl cursor-pointer">×</button>

        <template v-if="!editMode">
          <h3 class="text-xl font-semibold mb-2 text-[#134F5E]">{{ selectedItem.title }}</h3>
          <p class="text-gray-700"><strong>Hour:</strong> {{ selectedItem.hour }}</p>
          <p class="mt-2 text-gray-600">{{ selectedItem.description || 'No description' }}</p>
          <p v-if="selectedItem.is_important" class="mt-2 text-[#134F5E] font-bold">⚠️ This event is marked as important!</p>

          <div class="mt-4 flex gap-2">
            <button @click="editMode = true" class="bg-[#357c91] text-white px-3 py-1 rounded-lg font-medium cursor-pointer">✏️ Edit</button>
            <button @click="deleteItem(selectedItem.id)" class="bg-[#822323] text-white px-3 py-1 rounded-lg font-medium cursor-pointer">🗑️ Delete</button>
          </div>
        </template>

        <!-- Formular editare -->
        <form v-else @submit.prevent="submitEdit" class="mt-4 space-y-3">
          <input v-model="selectedItem.hour" type="time" class="border p-2 w-full rounded" required />
          <input v-model="selectedItem.title" class="border p-2 w-full rounded" />
          <textarea v-model="selectedItem.description" class="border p-2 w-full rounded" />
          <label class="flex items-center space-x-2">
            <input type="checkbox" v-model="selectedItem.is_important" />
            <span>Important</span>
          </label>
          <button class="bg-[#135B5A] hover:bg-[#134F5E] text-white w-full py-2 rounded-lg font-semibold transition cursor-pointer">
            💾 Save
          </button>
        </form>
      </div>
    </div>

    <!-- MODAL Formular Adăugare -->
    <div v-if="showForm" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full relative border border-[#E1F5F6]">
        <button @click="showForm = false" class="absolute top-2 right-2 text-gray-500 hover:text-black text-xl cursor-pointer">×</button>
        <form @submit.prevent="submitScheduleItem" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Hour</label>
            <input v-model="form.hour" type="time" class="border p-2 w-full rounded" required step="60" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <input v-model="form.title" type="text" placeholder="Title" class="border p-2 w-full rounded" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea v-model="form.description" placeholder="Description" class="border p-2 w-full rounded" />
          </div>
          <label class="flex items-center space-x-2">
            <input v-model="form.is_important" type="checkbox" />
            <span>Important</span>
          </label>
          <button class="bg-[#135B5A] hover:bg-[#134F5E] text-white px-4 py-2 rounded-lg w-full cursor-pointer font-semibold">
            Save Event
          </button>
        </form>
      </div>
    </div>

   <!-- Delete Confirmation Modal -->
<div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-[#CDEDEF]/40 backdrop-blur-sm z-50">
  <div class="bg-white rounded-xl p-6 shadow-lg w-[90%] max-w-md text-center">
    <h3 class="text-lg font-semibold text-[#134F5E] mb-4">Are you sure you want to delete this event?</h3>
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
import { ref, watch } from 'vue';
import { useScheduleStore } from '../../store/scheduleStore';

const props = defineProps({
  dailyPlanId: Number
});

const scheduleStore = useScheduleStore();

const form = ref({
  hour: '',
  title: '',
  description: '',
  is_important: false
});

const scheduleItems = ref([]);
const loading = ref(false);
const showForm = ref(false);
const selectedItem = ref(null);
const editMode = ref(false);

async function fetchSchedule() {
  if (!props.dailyPlanId) return;
  loading.value = true;
  await scheduleStore.loadScheduleItems(props.dailyPlanId);
  scheduleItems.value = scheduleStore.items;
  loading.value = false;
}

async function submitScheduleItem() {
  const item = {
    ...form.value,
    daily_plan_id: props.dailyPlanId
  };

  await scheduleStore.saveScheduleItem(item);
  form.value = { hour: '', title: '', description: '', is_important: false };
  showForm.value = false;
  fetchSchedule();
}

async function submitEdit() {
  await scheduleStore.editScheduleItem(selectedItem.value.id, selectedItem.value);
  editMode.value = false;
  closeDetails();
  fetchSchedule();
}

const showModal = ref(false);


function deleteItem(id) {
  selectedItem.value = id;
  showModal.value = true;
}

async function confirmDelete() {
  if (selectedItem.value) {
    await scheduleStore.removeScheduleItem(selectedItem.value);
    fetchSchedule();
  }
  showModal.value = false;
  selectedItem.value = null;
}

function cancelDelete() {
  showModal.value = false;
  selectedItem.value = null;
}


function openDetails(item) {
  selectedItem.value = { ...item };
  editMode.value = false;
}

function closeDetails() {
  selectedItem.value = null;
  editMode.value = false;
}

function getItemStyle(hourStr) {
  if (typeof hourStr !== 'string' || !hourStr.includes(':')) return {};
  const [h, m] = hourStr.split(':').map(Number);
  const topInMinutes = h * 60 + m;
  return {
    top: `${topInMinutes}px`,
    height: '50px'
  };
}

// ✅ Watch cu `immediate: true` pentru a asigura încărcarea după reload
watch(
  () => props.dailyPlanId,
  (newVal) => {
    if (newVal) fetchSchedule();
  },
  { immediate: true }
);
</script>
