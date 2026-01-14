<template>
  <div class="flex h-screen bg-gradient-to-br from-[#b4f2c6] via-[#94e9e8] to-[#f0cod5] text-gray-800">
    <!-- Sidebar -->
    <div
      :class="[
        'bg-[#135B5A] text-white p-2 transition-all duration-300 overflow-hidden',
        sidebarOpen ? 'w-64' : 'w-0'
      ]"
    >
      <div v-if="sidebarOpen" class="space-y-4 mt-10">
        <img :src="logobej" alt="PlaniFi Logo Bej" class=" h-40 w-auto mx-auto" />

        <RouterLink to="/home" class="block hover:text-blue-300 cursor-pointer ">🏠 Home</RouterLink>
        <RouterLink to="/budget" class="block hover:text-blue-300 cursor-pointer">💰 Budget Planner</RouterLink>
        <RouterLink to="/split" class="block hover:text-blue-300 cursor-pointer">🧾 Split</RouterLink>
        <RouterLink to="/account" class="block hover:text-blue-300 cursor-pointer">👤 Account</RouterLink>
        <button
          @click="goTo('/')"
          class=" text-[#fefefe] rounded-lg hover:bg-[#115251] hover:text-white transition cursor-pointer"
        >
        ❌ Log Out
        </button>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex flex-col flex-1 overflow-y-auto">
      <!-- Top bar with toggle -->
      <div class="p-4">
        <button @click="sidebarOpen = !sidebarOpen" class="p-2 bg-[#135B5A] text-white hover:bg-[#6EC0CD] rounded cursor-pointer">
          {{ sidebarOpen ? '❌ Close' : '📂 Menu' }}
        </button>
      </div>

      <!-- Content -->
<main class="flex-1 px-6 pb-10">
  <div class="max-w-7xl mx-auto space-y-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h1 class="text-3xl lg:text-4xl font-bold text-[#115251]">Task Manager - Your daily planning tool</h1>
      <input type="date" v-model="selectedDate" class="border border-gray-300 bg-[#135B5A] text-white rounded px-3 py-2 shadow-sm" />
    </div>

    <div v-if="loading" class="text-gray-500">Loading...</div>

    <div v-else>
      <div v-if="ready && dailyPlanId" class="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
  <!-- Column 1: Schedule -->
  <div class="bg-white rounded-2xl shadow-md p-4 border border-gray-200">
    <ScheduleSection :dailyPlanId="dailyPlanId" />
  </div>

  <!-- Column 2: To-Do & Call/Email one under another -->
  <div class="flex flex-col gap-6">
    <div class="bg-white rounded-2xl shadow-md p-4 border border-gray-200">
      <TodoSection :dailyPlanId="dailyPlanId" />
    </div>
    <div class="bg-white rounded-2xl shadow-md p-4 border border-gray-200">
      <ContactsSection :dailyPlanId="dailyPlanId" />
    </div>
  </div>

  <!-- Column 3: Notes, full height -->
  <div class="bg-white rounded-2xl shadow-md p-4 border border-gray-200 h-full self-stretch">
    <NotesSection :dailyPlanId="dailyPlanId" />
  </div>
</div>


      <div v-else class="text-gray-500">No plan exists yet for this date.</div>
    </div>
  </div>
</main>


      <!-- Footer -->
      <footer class="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4 border-t-2 border-[#aadad9] bg-[#c4e7e6] shadow-inner text-sm md:text-base text-[#177170]">
  <div class="flex items-center gap-2 font-semibold">
    <img :src="logoAlbastru" alt="PlaniFi Logo" class="h-14 w-auto" />
    <span>© 2025 PlaniFi — All rights reserved.</span>
  </div>
  <div class="italic">Your personal assistant to plan smart 💡</div>
</footer>
      

    </div>

    <!-- Logout Confirmation Modal -->
<!-- LOGOUT CONFIRM -->
<transition name="fade">
      <div v-if="showLogoutConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <transition name="scale">
          <div class="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
            <h3 class="text-2xl text-[#134F5E] font-semibold mb-6">Are you sure you want to log out?</h3>
            <div class="flex justify-center gap-4">
              <button 
                @click="confirmLogout"
                class="px-5 py-2 bg-[#134F5E] text-white rounded-lg hover:bg-[#6EC0CD] transition"
              >
                Yes
              </button>
              <button 
                @click="showLogoutConfirm = false"
                class="px-5 py-2 border border-[#134F5E] text-[#134F5E] rounded-lg hover:bg-[#6EC0CD] hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDailyPlanStore } from '../../store/dailyPlan';
import { useUserStore } from '../../store/user';
import ScheduleSection from '../../components/Planner/Schedule.vue';
import TodoSection from '../../components/Planner/TodoList.vue';
import ContactsSection from '../../components/Planner/CallEmailList.vue';
import NotesSection from '../../components/Planner/Notes.vue';
import logoAlbastru from '../../assets/planifialbastru.png';
import logobej  from '../../assets/planifibej.png';

const router = useRouter();
const dailyPlanStore = useDailyPlanStore();
const userStore = useUserStore();

const sidebarOpen = ref(true);
const showLogoutConfirm = ref(false);

const user = computed(() => userStore.user);
const loading = computed(() => dailyPlanStore.loading);
const selectedDate = ref(new Date().toISOString().substring(0, 10));
const dailyPlanId = ref(null);

const ready = ref(false);
const isLoadingPlan = ref(false);


async function fetchOrCreateDailyPlan() {
  if (isLoadingPlan.value || !user.value?.id) return;
  isLoadingPlan.value = true;
  ready.value = false;
  try {
    const plan = await dailyPlanStore.loadOrCreatePlan(user.value.id, selectedDate.value);
    dailyPlanId.value = plan?.id || null;
    
    // Delay de siguranță
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    ready.value = true;
  } finally {
    isLoadingPlan.value = false;
  }
}


watch(selectedDate, fetchOrCreateDailyPlan);
watch(user, async (newUser) => {
  if (newUser?.id) await fetchOrCreateDailyPlan();
});

onMounted(async () => {
  try {
    userStore.loadUser();
    if (user.value?.id) await fetchOrCreateDailyPlan();
  } catch (error) {
    console.error("Eroare la încărcarea utilizatorului:", error);
  }
});

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

</script>
