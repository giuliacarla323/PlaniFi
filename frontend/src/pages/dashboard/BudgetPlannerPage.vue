<template>
  <div class="flex h-screen bg-[linear-gradient(90deg,_rgba(200,232,172,1)_0%,_rgba(207,250,167,1)_50%,_rgba(156,217,152,1)_100%)] text-gray-800">
    
    <!-- Sidebar -->
    <div :class="['bg-[#48763D] text-white p-4 transition-all duration-300 overflow-hidden', sidebarOpen ? 'w-64' : 'w-0']">
      <div v-if="sidebarOpen" class="space-y-4 mt-10">
        <img :src="logobej" alt="PlaniFi Logo Bej" class=" h-40 w-auto mx-auto" />
        <RouterLink to="/home" class="block hover:text-blue-300"> 🏠 Home</RouterLink>
        <RouterLink to="/planner" class="block hover:text-blue-300"> 🗓️ Task Manager</RouterLink>
        <RouterLink to="/split" class="block hover:text-blue-300"> 🧾 Split</RouterLink>
        <RouterLink to="/account" class="block hover:text-blue-300"> 👤 Account</RouterLink>
        <button @click="goTo('/')" class=" text-[#fefefe] rounded-lg hover:text-blue-300 transition cursor-pointer">
          ❌ Log Out
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col flex-1 overflow-y-auto">
      
      <!-- Topbar -->
      <div class="p-4">
        <button @click="sidebarOpen = !sidebarOpen" class="p-2 bg-[#48763D] text-white rounded hover:bg-[#90C084] cursor-pointer">
          {{ sidebarOpen ? '❌ Close' : '📂 Menu' }}
        </button>
      </div>

      <!-- Page Content -->
      <main class="px-6 pb-10">
        <div class="max-w-6xl mx-auto space-y-8">

          <!-- Titlu + Selector -->
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 class="text-3xl font-bold  text-[#21371C]">Monthly Budget Planner</h2>
            <input
              type="month"
              v-model="selectedMonth"
              class="border border-[#21371C] px-4 py-2 rounded bg-[#48763D] text-white shadow focus:ring-2 focus:ring-[#94e89b] cursor-pointer transform transition-transform duration-200 hover:scale-105"
            />
            <button @click="generatePDF" class="bg-[#48763D] text-white px-4 py-2 rounded hover:bg-[#90C084] cursor-pointer">
  📄 Export PDF
</button>

          </div>

          <!-- Loading Indicator -->
          <div v-if="loading" class="mt-4 text-gray-500">Loading...</div>

          <!-- Display Content After Data is Ready -->
          <div v-else-if="budgetPlanId">
            <!-- Total Balance -->
            <div class="mt-6 text-center">
              <div class="inline-block px-6 py-3 text-2xl font-bold text-[#21371C] bg-[#edf8de] shadow-md border-2 border-[#70b570] rounded-xl">
                💵 Total Balance: <span class="text-[#2f6632]">{{ totalBalance }} RON</span>
              </div>
            </div>

            <!-- Incomes + Overview -->
            <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-[#edf8de] border border-[#bde1c7] rounded-xl shadow-lg p-4">
                <Incomes :plan-id="budgetPlanId" />
              </div>

              <div class="bg-[#edf8de] border border-[#bde1c7] rounded-xl shadow-lg p-4">
                <h3 class="text-lg font-semibold text-[#21371C] mb-2">📋 Monthly Overview</h3>
                <p><strong>Total Incomes:</strong> {{ totalIncome }} RON</p>
                <p><strong>Total Spent:</strong> {{ totalExpenses }} RON</p>
              </div>
            </div>

            <!-- Category Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
              <CategoryCard
                v-for="cat in categories"
                :key="cat"
                :category="cat"
                :plan-id="budgetPlanId"
                :budget="getBudget(cat)"
                :expenses="getExpenses(cat)"
                @updated="reloadData"
              />
            </div>
          </div>

          

          <!-- No Plan Available Message -->
          <div v-else class="mt-6 text-red-600 font-medium text-center">
            ❗There is no plan for this month.
          </div>
          <div id="pdf-content" class="hidden">
  <h1 class="text-2xl font-bold mb-2">PlaniFi - Monthly Report</h1>
  <p><strong>Month:</strong> {{ selectedMonth }}</p>
  <p><strong>Total Income:</strong> {{ totalIncome }} RON</p>
  <p><strong>Total Expenses:</strong> {{ totalExpenses }} RON</p>
  <p><strong>Balance:</strong> {{ totalBalance }} RON</p>

  <!-- Pie chart canvas -->
  <canvas id="expensesChart" width="400" height="400"></canvas>
</div>


        </div>
      </main>

      <!-- Footer -->
      <footer class="px-6 py-4 border-t-2 border-[#99bd8f]  bg-[#C8E8AC] text-sm text-[#21371C] flex justify-between items-center">
       <div class="flex items-center gap-2 font-semibold">
        <img :src="logoVerde" alt="PlaniFi Logo" class="h-14 w-auto" />
        <span>© 2025 PlaniFi -All rights reserved.</span>
        </div>
        <div class="italic">Your personal assistant to plan smart 💡</div>
      </footer>
    </div>

    <!-- Logout Modal -->
    <transition name="fade">
      <div v-if="showLogoutConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
          <h3 class="text-2xl text-[#21371C] font-semibold mb-6">Are you sure you want to log out?</h3>
          <div class="flex justify-center gap-4">
            <button @click="confirmLogout" class="px-5 py-2 bg-[#48763D] text-white rounded-lg hover:bg-[#bce7b2] transition cursor-pointer">Yes</button>
            <button @click="showLogoutConfirm = false" class="px-5 py-2 border border-[#48763D] text-[#48763D] rounded-lg hover:bg-[#c9e7c1] hover:text-white transition cursor-pointer">Cancel</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted,nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../store/user';
import { useBudgetPlanStore } from '../../store/budget/budgetPlanStore';
import { useIncomeStore } from '../../store/budget/incomeStore';
import { useExpenseStore } from '../../store/budget/expenseStore';
import { useBudgetStore } from '../../store/budget/budgetStore';
import Incomes from '../../components/Budget/Incomes.vue';
import CategoryCard from '../../components/Budget/CategoryCard.vue';
import logobej from '../../assets/planifibej.png';
import logoVerde from '../../assets/planifiverde.png';

const router = useRouter();
const sidebarOpen = ref(true);
const showLogoutConfirm = ref(false);

const userStore = useUserStore();
const budgetPlanStore = useBudgetPlanStore();
const incomeStore = useIncomeStore();
const expenseStore = useExpenseStore();
const budgetStore = useBudgetStore();

const selectedMonth = ref(new Date().toISOString().substring(0, 7));
const budgetPlanId = ref(null);
const loading = computed(() => budgetPlanStore.loading);
const user = computed(() => userStore.user);

const categories = [
  'Main', 'House', 'Bills', 'Groceries', 'Transportation',
  'Personal', 'Entertainment', 'Emergencies', 'Others'
];

async function loadBudgetForMonth() {
  if (!user.value?.id) return;
  const plan = await budgetPlanStore.loadOrCreatePlan(user.value.id, selectedMonth.value);
  budgetPlanId.value = plan?.id || null;
  if (plan?.id) await reloadData();
}

async function reloadData() {
  if (!budgetPlanId.value) return;
  await Promise.all([
    incomeStore.loadIncomes(budgetPlanId.value),
    expenseStore.loadExpenses(budgetPlanId.value),
    budgetStore.loadBudgets(budgetPlanId.value)
  ]);
}

const totalIncome = computed(() =>
  incomeStore.incomes.reduce((sum, i) => sum + (i.amount || 0), 0)
);
const totalExpenses = computed(() =>
  expenseStore.expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
);
const totalBalance = computed(() => totalIncome.value - totalExpenses.value);

function getBudget(cat) {
  const found = budgetStore.budgets.find(b => b.category === cat);
  return found ? found.amount : 0;
}

function getExpenses(cat) {
  return expenseStore.expenses.filter(e => e.category === cat);
}

function goTo(path) {
  sidebarOpen.value = false;
  if (path === '/') {
    showLogoutConfirm.value = true;
  } else {
    router.push(path);
  }
}

function confirmLogout() {
  userStore.setUser(null);
  localStorage.removeItem("user");
  showLogoutConfirm.value = false;
  router.push('/');
}

watch(selectedMonth, loadBudgetForMonth);
watch(user, async (newUser) => {
  if (newUser?.id) await loadBudgetForMonth();
});

onMounted(async () => {
  userStore.loadUser();
  if (user.value?.id) await loadBudgetForMonth();
});


import html2pdf from 'html2pdf.js';

import { Chart } from 'chart.js/auto';

let chartInstance = null; // global pentru grafic

async function generatePDF() {
  await nextTick();

  if (chartInstance) {
    chartInstance.destroy();
  }

  const canvas = document.getElementById('expensesChart');
  const ctx = canvas.getContext('2d');

  // Date reale pentru cheltuieli pe categorii
  const expenseLabels = [];
  const expenseData = [];

  categories.forEach(cat => {
    const totalCat = expenseStore.expenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    if (totalCat > 0) {
      expenseLabels.push(cat);
      expenseData.push(totalCat);
    }
  });

  chartInstance = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: expenseLabels,
    datasets: [{
      data: expenseData,
      backgroundColor: [
        '#48763D', '#6FAF66', '#A7C97A', '#D4E7A7',
        '#6B8E23', '#9ACD32', '#556B2F', '#8FBC8F', '#B2D8B2'
      ],
      borderWidth: 1,
      borderColor: '#fff'
    }]
  },
  options: {
    responsive: false,
    animation: false,
    plugins: {
  legend: {
    display: true,
    position: 'right',
    labels: {
      boxWidth: 15,
      padding: 10,
      generateLabels(chart) {
        const data = chart.data;
        return data.labels.map((label, i) => {
          const value = data.datasets[0].data[i];
          return {
            text: `${label}: ${value} RON`,
            fillStyle: data.datasets[0].backgroundColor[i],
            strokeStyle: '#fff',
            lineWidth: 1,
            hidden: !chart.getDatasetMeta(0).data[i],
            index: i
          };
        });
      }
    }
  }
}

  }
});


  const pdfContent = document.getElementById('pdf-content');
  pdfContent.classList.remove('hidden');

  const opt = {
    margin: 0.5,
    filename: `budget_report_${selectedMonth.value}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  await html2pdf().from(pdfContent).set(opt).save();

  pdfContent.classList.add('hidden');

  chartInstance.destroy();
  chartInstance = null;
}






</script>
