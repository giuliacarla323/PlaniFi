<!-- components/Budget/BudgetCategories.vue -->
<template>
    <div class="mt-8">
      <h3 class="text-xl font-semibold text-[#135B5A] mb-4">📂 Budget Categories</h3>
  
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="category in categories"
          :key="category"
          class="bg-white border border-gray-200 rounded-xl p-4 shadow flex flex-col gap-2"
        >
          <label class="font-medium text-gray-700">{{ category }}</label>
          <input
            type="number"
            v-model.number="inputs[category]"
            class="border rounded px-3 py-1 w-full"
            placeholder="Amount (RON)"
            @blur="submitBudget(category)"
            min="0"
          />
        </div>
      </div>
  
      <div class="mt-6">
        <p class="font-semibold text-gray-700">
          Total Categorii (fără Main): {{ totalOther }} RON / Main: {{ main }} RON
        </p>
        <p v-if="warning" class="text-red-600 font-medium mt-2">
  {{ warning }}
</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref,reactive, computed, onMounted, watch } from 'vue';
  import { useBudgetStore } from '../../store/budget/budgetStore';
  
  const props = defineProps({ planId: Number });
  const budgetStore = useBudgetStore();
  
  const categories = [
    'Main',
    'House',
    'Bills',
    'Groceries',
    'Transportation',
    'Personal',
    'Entertainment',
    'Emergencies',
    'Others'
  ];
  
  const inputs = reactive({});
  
  const main = computed(() => budgetStore.mainBudget);
  const totalOther = computed(() => budgetStore.totalOtherBudgets);
  
  function syncInputs() {
    inputs.value = {};
    categories.forEach(cat => {
      const existing = budgetStore.budgets.find(b => b.category === cat);
      inputs[cat] = existing ? existing.amount : 0;
    });
  }
  
  const warning = ref('');

async function submitBudget(category) {
  const amount = inputs[category];
  if (amount < 0 || isNaN(amount)) return;

  // Verificăm limita doar dacă NU este "Main"
  if (category !== 'Main') {
    const otherTotal = totalOther.value - (budgetStore.budgets.find(b => b.category === category)?.amount || 0);
    const newTotal = otherTotal + amount;

    if (newTotal > main.value) {
      warning.value = '⚠️ You have exceeded the Main budget!';
      inputs[category] = budgetStore.budgets.find(b => b.category === category)?.amount || 0;
      return;
    } else {
      warning.value = ''; // Resetăm dacă e ok
    }
  }

  await budgetStore.saveBudget({
    category,
    amount,
    budget_plan_id: props.planId
  });
}

  watch(() => props.planId, async (newId) => {
    if (newId) {
      await budgetStore.loadBudgets(newId);
      syncInputs();
    }
  }, { immediate: true });
  
  onMounted(() => {
    if (props.planId) {
      budgetStore.loadBudgets(props.planId).then(syncInputs);
    }
  });
  </script>
  