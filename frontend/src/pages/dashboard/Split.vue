<template>
  <div class="flex h-screen bg-gradient-to-br from-[#c2adea] via-[#f1a1fd] to-[#f0cod5] text-gray-800">
    <!-- Sidebar -->
    <div
      :class="[
        'bg-[#9B76DF] text-white p-2 transition-all duration-300 overflow-hidden',
        sidebarOpen ? 'w-64' : 'w-0'
      ]"
    >
      <div v-if="sidebarOpen" class="space-y-4 mt-10">
        <img :src="logobej" alt="PlaniFi Logo Bej" class="h-40 w-auto mx-auto" />
        <RouterLink to="/home" class="block hover:text-blue-300 cursor-pointer">🏠 Home</RouterLink>
        <RouterLink to="/planner" class="block hover:text-blue-300"> 🗓️ Task Manager</RouterLink>
        <RouterLink to="/budget" class="block hover:text-blue-300 cursor-pointer">💰 Budget Planner</RouterLink>
      
        <RouterLink to="/account" class="block hover:text-blue-300 cursor-pointer">👤 Account</RouterLink>
        <button
          @click="goTo('/')"
          class="text-[#fefefe] rounded-lg hover:bg-[#9B76DF] hover:text-white transition cursor-pointer"
        >
          ❌ Log Out
        </button>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex flex-col flex-1 overflow-y-auto">
      <!-- Top bar -->
      <div class="p-4">
        <button @click="sidebarOpen = !sidebarOpen" class="p-2 bg-[#9B76DF] text-white hover:bg-[#a594c3] rounded cursor-pointer">
          {{ sidebarOpen ? '❌ Close' : '📂 Menu' }}
        </button>
      </div>

      <!-- Page Content -->
      <main class="flex-1 px-6 pb-10">
        <div class="max-w-5xl mx-auto space-y-10">
          <h2 class="text-3xl font-bold text-[#4c3a6d]">🤝 Split Expenses with Friends</h2>
          <div class="bg-white p-4 rounded-xl shadow">
            <GroupManager />
          </div>
          
          <div class="bg-white p-4 rounded-xl shadow">
            <SharedExpenses />
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4 border-t-2 border-[#c1a8ef] bg-[#dcd1f3] shadow-inner text-sm md:text-base text-[##4c3a6d]">
        <div class="flex items-center gap-2 font-semibold">
          <img :src="logoAlbastru" alt="PlaniFi Logo" class="h-14 w-auto" />
          <span>© 2025 PlaniFi — All rights reserved.</span>
        </div>
        <div class="italic">Your personal assistant to plan smart 💡</div>
      </footer>
    </div>

    <!-- Logout Confirmation Modal -->
    <transition name="fade">
      <div v-if="showLogoutConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <transition name="scale">
          <div class="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
            <h3 class="text-2xl text-[#4c3a6d] font-semibold mb-6">Are you sure you want to log out?</h3>
            <div class="flex justify-center gap-4">
              <button @click="confirmLogout" class="px-5 py-2 bg-[#4c3a6d] text-white rounded-lg hover:bg-[#6EC0CD] transition">
                Yes
              </button>
              <button @click="showLogoutConfirm = false" class="px-5 py-2 border border-[#4c3a6d] text-[#4c3a6d] rounded-lg hover:bg-[#6EC0CD] hover:text-white transition">
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../store/user';
import { useFriendRequestStore } from '../../store/friends/friendRequestStore';
import SharedExpenses from '../../components/Friends/SharedExpense.vue';
import logobej from '../../assets/planifibej.png';
import logoAlbastru from '../../assets/planifimov.png';
import GroupManager from '../../components/Friends/GroupManager.vue';

const userStore = useUserStore();
const friendStore = useFriendRequestStore();
const router = useRouter();

const sidebarOpen = ref(true);
const showLogoutConfirm = ref(false);
const user = computed(() => userStore.user);

onMounted(() => {
  userStore.loadUser();
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
