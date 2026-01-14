<template>
  <div class="bg-[#edf8de] border-[#0a350e] rounded-xl p-4 shadow space-y-4 relative">
    <h4 class="font-semibold text-[#21371C] text-lg">
      {{ category === 'Main' ? '💼 Monthly Budget' : category }}
    </h4>

    <!-- Buget -->
    <div>
      <label class="text-sm text-[#21371C]">Budget (RON)</label>
      <input
        type="number"
        v-model.number="localBudget"
        class="border rounded px-2 py-1 w-full"
        @blur="handleBudgetUpdate"
        min="0"
      />
      <p v-if="budgetWarning" class="text-red-600 text-sm mt-1">
        {{ budgetWarning }}
      </p>
    </div>

    <!-- Doar dacă NU este Main -->
    <div v-if="category !== 'Main'">
      <p class="text-sm text-[#21371C]">Expenses</p>
      <form @submit.prevent="submitExpense" class="flex flex-wrap gap-2 items-center">
        <input
          v-model="form.description"
          placeholder="Description"
          class="border px-2 py-1 rounded flex-1 min-w-0"
        />
        <input
          v-model.number="form.amount"
          type="number"
          placeholder="Amount"
          class="border px-2 py-1 rounded w-24"
        />
        <button class="bg-[#48763D] text-white px-3 py-1 rounded cursor-pointer">
          {{ isEditing ? 'Update' : 'Add' }}
        </button>
        <button
          v-if="isEditing"
          @click.prevent="resetForm"
          class="text-[#21371C] cursor-pointer text-sm"
        >
          Cancel
        </button>
      </form>

      <!-- Listă cheltuieli -->
      <ul class="mt-2 space-y-1">
        <li
          v-for="exp in expensesForCategory"
          :key="exp.id"
          class="flex justify-between items-center border p-2 rounded text-[#21371C]"
        >
          <span>{{ exp.description }} - {{ exp.amount }} RON</span>
          <div class="space-x-2">
            <button @click="editExpense(exp)" class="text-blue-500 text-sm cursor-pointer">✏️</button>
            <button @click="openDeleteModal(exp.id)" class="text-red-500 text-sm cursor-pointer">🗑️</button>
          </div>
        </li>
      </ul>

      <p class="text-sm font-medium text-[#21371C] mt-1">
        Total Spent: {{ totalSpent }} RON
        <span v-if="overBudget" class="text-red-600 font-semibold ml-2">⚠️ Over Budget!</span>
      </p>
    </div>

    <!-- Modal de confirmare -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-[#CDEDEF]/40 backdrop-blur-sm z-50">
      <div class="bg-white rounded-xl p-6 shadow-lg w-[90%] max-w-md text-center">
        <h3 class="text-lg font-semibold text-[#134F5E] mb-4">Are you sure you want to delete this expense?</h3>
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
import { ref, computed, watch } from 'vue';
import { useBudgetStore } from '../../store/budget/budgetStore';
import { useExpenseStore } from '../../store/budget/expenseStore';

const props = defineProps({ category: String, planId: Number });

const budgetStore = useBudgetStore();
const expenseStore = useExpenseStore();

const form = ref({ description: '', amount: null });
const editingId = ref(null);
const localBudget = ref(0);
const budgetWarning = ref('');

const isEditing = computed(() => editingId.value !== null);

const allBudgets = computed(() => budgetStore.budgets);
const allExpenses = computed(() => expenseStore.expenses);

const expensesForCategory = computed(() =>
  allExpenses.value.filter(e => e.category === props.category)
);

const totalSpent = computed(() =>
  expensesForCategory.value.reduce((sum, e) => sum + (e.amount || 0), 0)
);

const overBudget = computed(() => {
  const budget = localBudget.value;
  return budget > 0 && totalSpent.value > budget;
});

function resetForm() {
  form.value = { description: '', amount: null };
  editingId.value = null;
}

function editExpense(exp) {
  form.value = { description: exp.description, amount: exp.amount };
  editingId.value = exp.id;
}

// Modal state
const showModal = ref(false);
const expenseToDelete = ref(null);

// Deschide modalul
function openDeleteModal(id) {
  expenseToDelete.value = id;
  showModal.value = true;
}

function cancelDelete() {
  showModal.value = false;
  expenseToDelete.value = null;
}

async function deleteConfirmed() {
  if (expenseToDelete.value) {
    await expenseStore.removeExpense(expenseToDelete.value);
    await expenseStore.loadExpenses(props.planId);
  }
  showModal.value = false;
  expenseToDelete.value = null;
}

async function submitExpense() {
  const { description, amount } = form.value;
  if (!description || amount == null || amount < 0) return;

  const payload = {
    description,
    amount,
    budget_plan_id: props.planId,
    category: props.category
  };

  if (editingId.value) {
    await expenseStore.editExpense(editingId.value, payload);
  } else {
    await expenseStore.createExpense(payload);
  }

  resetForm();
  await expenseStore.loadExpenses(props.planId);
}

async function handleBudgetUpdate() {
  const amount = localBudget.value;
  if (amount < 0 || isNaN(amount)) return;

  if (props.category !== 'Main') {
    const currentBudget = budgetStore.budgets.find(
      b => b.category === props.category && b.budget_plan_id === props.planId
    )?.amount || 0;

    const otherBudgets = budgetStore.budgets.filter(
      b => b.category !== 'Main' && b.category !== props.category && b.budget_plan_id === props.planId
    );

    const otherTotal = otherBudgets.reduce((sum, b) => sum + (b.amount || 0), 0);
    const mainBudget = budgetStore.budgets.find(
      b => b.category === 'Main' && b.budget_plan_id === props.planId
    )?.amount || 0;

    const newTotal = otherTotal + amount;

    if (newTotal > mainBudget) {
      budgetWarning.value = '⚠️ Total small budgets exceed Main budget!';
      localBudget.value = currentBudget;
      return;
    } else {
      budgetWarning.value = '';
    }
  }

  await budgetStore.saveBudget({
    category: props.category,
    amount,
    budget_plan_id: props.planId
  });

  await budgetStore.loadBudgets(props.planId);
}

// Încarcă bugetele și cheltuielile când se schimbă planul
watch(
  () => props.planId,
  async (newPlanId) => {
    if (newPlanId) {
      await budgetStore.loadBudgets(newPlanId);
      await expenseStore.loadExpenses(newPlanId);
    }
  },
  { immediate: true }
);

// Actualizează localBudget după ce bugetele sunt încărcate
watch(
  [() => budgetStore.budgets, () => props.category, () => props.planId],
  ([budgets, category, planId]) => {
    const existing = budgets.find(b => b.category === category && b.budget_plan_id === planId);
    localBudget.value = existing ? existing.amount : 0;
  }
);
</script>
