<template>
  <div>
    <h3 class="text-xl font-semibold text-[#21371C]">
      💰 Incomes
      <span class="text-sm text-[#21371C]">– Total: {{ totalIncome }} RON</span>
    </h3>

    <!-- Form -->
    <form @submit.prevent="submitIncome" class="space-x-2 mt-4 flex items-center">
      <input
        v-model="form.description"
        placeholder="Description"
        class="border p-1 rounded"
      />
      <input
        v-model.number="form.amount"
        type="number"
        placeholder="Amount"
        class="border p-1 rounded w-24"
      />
      <button
        class="bg-[#48763D] text-white px-3 py-1 rounded disabled:opacity-100 cursor-pointer"
        :disabled="!form.description || !form.amount"
      >
        {{ editingId ? 'Update' : 'Add' }}
      </button>
      <button
        v-if="editingId"
        @click.prevent="cancelEdit"
        class="text-sm text-[#21371C] cursor-pointer"
      >
        Cancel
      </button>
    </form>

    <!-- Income list -->
    <ul class="mt-4 space-y-2">
      <li
        v-for="income in incomes"
        :key="income.id"
        class="flex justify-between items-center text-[#21371C]"
      >
        <span>{{ income.description }} - {{ income.amount }} RON</span>
        <div class="space-x-2">
          <button @click="edit(income)" class="text-[#21371C] text-sm cursor-pointer">✏️</button>
          <button @click="confirmDelete(income.id)" class="text-[#21371C] text-sm cursor-pointer">🗑️</button>
        </div>
      </li>
    </ul>

    <div v-if="loading" class="text-gray-500 mt-2">Loading incomes...</div>
    <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-[#CDEDEF]/40 backdrop-blur-sm z-50">
  <div class="bg-white rounded-xl p-6 shadow-lg w-[90%] max-w-md text-center">
    <h3 class="text-lg font-semibold text-[#134F5E] mb-4">Are you sure you want to delete this income?</h3>
    <div class="flex justify-center gap-4">
      <button
        @click="deleteConfirmed"
        class="bg-[#EF4444] cursor-pointer hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition"
      >
        Yes, delete
      </button>
      <button
        @click="cancelDelete"
        class="bg-[#48763D] cursor-pointer hover:bg-[#c8e4c1] text-white px-4 py-2 rounded-lg shadow transition"
      >
        Cancel
      </button>
    </div>
  </div>
</div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useIncomeStore } from '../../store/budget/incomeStore';

const props = defineProps({ planId: Number });

const incomeStore = useIncomeStore();
const incomes = computed(() => incomeStore.incomes);
const loading = computed(() => incomeStore.loading);
const error = computed(() => incomeStore.error);

const form = ref({ description: '', amount: '' });
const editingId = ref(null);

const totalIncome = computed(() =>
  incomes.value.reduce((sum, income) => sum + (Number(income.amount) || 0), 0)
);

function edit(income) {
  form.value = { description: income.description, amount: income.amount };
  editingId.value = income.id;
}

function cancelEdit() {
  form.value = { description: '', amount: '' };
  editingId.value = null;
}

async function fetchIncomes() {
  if (props.planId) await incomeStore.loadIncomes(props.planId);
}

async function submitIncome() {
  if (!form.value.description || !form.value.amount) return;

  const income = {
    description: form.value.description,
    amount: Number(form.value.amount),
    budget_plan_id: props.planId,
  };

  if (editingId.value) {
    await incomeStore.editIncome(editingId.value, income);
  } else {
    await incomeStore.createIncome(income);
  }

  cancelEdit();
  await fetchIncomes();
}

// Modal state
const showModal = ref(false);
const incomeToDelete = ref(null);

function confirmDelete(id) {
  incomeToDelete.value = id;
  showModal.value = true;
}

function cancelDelete() {
  incomeToDelete.value = null;
  showModal.value = false;
}

async function deleteConfirmed() {
  if (incomeToDelete.value) {
    await incomeStore.removeIncome(incomeToDelete.value);
    await fetchIncomes();
  }
  showModal.value = false;
  incomeToDelete.value = null;
}

watch(
  () => props.planId,
  (newVal) => {
    if (newVal) fetchIncomes();
  },
  { immediate: true }
);
</script>
