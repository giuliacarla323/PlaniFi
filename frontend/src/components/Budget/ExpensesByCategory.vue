<!-- components/Budget/ExpensesByCategory.vue -->
<template>
    <div class="mt-10">
      <h3 class="text-xl font-semibold text-[#135B5A] mb-4">🧾 Expenses by Category</h3>
  
      <div v-for="cat in categories" :key="cat" class="mb-8">
        <h4 class="font-bold text-[#134F5E] mb-2">{{ cat }}</h4>
  
        <form @submit.prevent="submitExpense(cat)" class="flex items-center space-x-2 mb-4">
          <input
            v-model="forms[cat].description"
            placeholder="Description"
            class="border px-3 py-1 rounded"
          />
          <input
            v-model.number="forms[cat].amount"
            type="number"
            placeholder="Amount"
            class="border px-3 py-1 rounded w-24"
          />
          <button class="bg-[#135B5A] text-white px-3 py-1 rounded">Add</button>
          <button
            v-if="forms[cat].id"
            @click.prevent="resetForm(cat)"
            class="text-sm text-gray-500"
          >Cancel</button>
        </form>
  
        <ul class="space-y-1">
          <li
            v-for="exp in expensesByCategory[cat] || []"
            :key="exp.id"
            class="flex justify-between items-center border p-2 rounded"
          >
            <span>{{ exp.description }} - {{ exp.amount }} RON</span>
            <div class="space-x-2">
              <button @click="editExpense(cat, exp)" class="text-blue-500 text-sm">Edit</button>
              <button @click="removeExpense(exp.id)" class="text-red-500 text-sm">Delete</button>
            </div>
          </li>
        </ul>
  
        <p class="text-sm text-gray-600 mt-2 font-medium">
          Total {{ cat }}: {{ totalByCategory[cat] || 0 }} RON
        </p>
      </div>
  
      <div class="mt-10 border-t pt-4">
        <p class="text-lg font-semibold text-[#134F5E]">
          💸 Total cheltuieli lunare: {{ overallTotal }} RON
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref, watch, onMounted, computed } from 'vue';
  import { useExpenseStore } from '../../store/budget/expenseStore';
  
  const props = defineProps({ planId: Number });
  const expenseStore = useExpenseStore();
  
  const categories = [
    'House', 'Bills', 'Groceries', 'Transportation',
    'Personal', 'Entertainment', 'Emergencies', 'Others'
  ];
  
  const forms = reactive({});
  const expensesByCategory = reactive({});
  
  function resetForm(cat) {
    forms[cat] = { description: '', amount: null, id: null };
  }
  
  function editExpense(category, exp) {
    forms[category] = {
      description: exp.description,
      amount: exp.amount,
      id: exp.id
    };
  }
  
  async function submitExpense(category) {
    const { description, amount, id } = forms[category];
    if (!description || amount == null || amount < 0) return;
  
    const expense = {
      description,
      amount,
      budget_plan_id: props.planId,
      category
    };
  
    if (id) {
      await expenseStore.editExpense(id, expense);
    } else {
      await expenseStore.createExpense(expense);
    }
  
    resetForm(category);
    await loadExpenses();
  }
  
  async function removeExpense(id) {
    if (confirm('Confirm delete?')) {
      await expenseStore.removeExpense(id);
      await loadExpenses();
    }
  }
  
  async function loadExpenses() {
    if (!props.planId) return;
    await expenseStore.loadExpenses(props.planId);
  
    for (const cat of categories) {
      expensesByCategory[cat] = expenseStore.expenses.filter(e => e.category === cat);
      if (!forms[cat]) resetForm(cat);
    }
  }
  
  const totalByCategory = computed(() => {
    const totals = {};
    for (const cat of categories) {
      totals[cat] = (expensesByCategory[cat] || []).reduce((sum, e) => sum + (e.amount || 0), 0);
    }
    return totals;
  });
  
  const overallTotal = computed(() =>
    Object.values(totalByCategory.value).reduce((sum, val) => sum + val, 0)
  );
  
  onMounted(() => {
    for (const cat of categories) {
      resetForm(cat);
      expensesByCategory[cat] = [];
    }
  
    if (props.planId) loadExpenses();
  });
  
  watch(() => props.planId, loadExpenses, { immediate: true });
  </script>
  