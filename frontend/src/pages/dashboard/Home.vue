<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchDailyQuote } from '../../services/quoteService.js';
import { useUserStore } from '../../store/user';
import logoAlbastru from '../../assets/Planifialbastru.png';

const quote = ref('');
const router = useRouter();
const userStore = useUserStore();

// Obține user-ul din store, mereu sincronizat
const user = computed(() => userStore.user);

const showLogoutConfirm = ref(false);

onMounted(async () => {
  try {
    // Încarcă utilizatorul salvat în localStorage
    userStore.loadUser();

    // Fetch citatul zilei
    const data = await fetchDailyQuote();
    quote.value = data.text;

  } catch (error) {
    console.error("Eroare la încărcarea citatului zilei:", error);
  }
});

function goTo(section) {
  if (section === '/') {
    showLogoutConfirm.value = true;
  } else {
    router.push(section);
  }
}

function confirmLogout() {
  userStore.setUser(null); // Șterge user-ul și din store
  localStorage.removeItem("user");
  showLogoutConfirm.value = false;
  router.push('/');
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-[radial-gradient(circle,_rgba(240,192,213,1)_0%,_rgba(148,233,232,1)_83%,_rgba(180,242,198,1)_100%)] text-gray-800">

    <!-- HEADER -->
    <header class="flex justify-between items-center p-6 border-b-2 border-white/70 bg-white/70 shadow-md">
      <h1 class="text-3xl font-bold text-[#177170]">Welcome, {{ user?.username || 'Guest' }}!</h1>
      <div class="space-x-3">
        <button @click="goTo('/account')" class="px-4 py-2 bg-[#177170] text-white rounded-lg hover:bg-[#115251] transition cursor-pointer">
          Account
        </button>
        <button @click="goTo('/')" class="px-4 py-2 border border-[#177170] text-[#177170] rounded-lg hover:bg-[#115251] hover:text-white transition cursor-pointer">
          Log out
        </button>
      </div>
    </header>

    <!-- MAIN CONTENT -->
    <main class="flex-grow flex flex-col items-center justify-start px-6 py-12 space-y-12">

      <!-- STILIZARE CITAT -->
      <transition name="fade-slide">
        <blockquote class="text-center max-w-3xl text-xl md:text-2xl italic text-[#3a3a3a] px-4 bg-white/50 py-4 rounded-xl shadow">
          {{ quote || 'No quote available today.' }}
        </blockquote>
      </transition>

      <!-- TOOLS -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl animate-fadeIn">
        <div @click="goTo('/planner')" class="cursor-pointer bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition border border-gray-300">
          <h2 class="text-2xl font-semibold text-[#177170] mb-3">Task Manager</h2>
          <p class="text-gray-700 text-base">Start planning your day! Schedule and organize your time efficiently using our powerful task manager.</p>
        </div>

        <div @click="goTo('/budget')" class="cursor-pointer bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition border border-gray-300">
          <h2 class="text-2xl font-semibold text-[#177170] mb-3">Budget Planner</h2>
          <p class="text-gray-700 text-base">Track your income and expenses with ease. Gain insights into your financial habits and reach your saving goals.</p>
        </div>

        <div @click="goTo('/split')" class="cursor-pointer bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition border border-gray-300">
          <h2 class="text-2xl font-semibold text-[#177170] mb-3">Split with Friends</h2>
          <p class="text-gray-700 text-base">Manage shared expenses with friends. Keep everything fair and transparent with our smart split tool.</p>
        </div>
      </div>
    </main>

    <!-- FOOTER -->
    <footer class="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4 border-t-2 border-[#bae5e4] bg-[#c4f8f7] shadow-inner text-sm md:text-base text-[#177170]">
  <div class="flex items-center gap-2 font-semibold">
    <img :src="logoAlbastru" alt="PlaniFi Logo" class="h-14 w-auto" />
    <span>© 2025 PlaniFi — All rights reserved.</span>
  </div>
  <div class="italic">Your personal assistant to plan smart 💡</div>
</footer>


    <!-- LOGOUT CONFIRM -->
    <transition name="fade">
      <div v-if="showLogoutConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <transition name="scale">
          <div class="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
            <h3 class="text-2xl text-[#9B76DF] font-semibold mb-6">Are you sure you want to log out?</h3>
            <div class="flex justify-center gap-4">
              <button 
                @click="confirmLogout"
                class="px-5 py-2 bg-[#9B76DF] text-white rounded-lg hover:bg-[#614594] transition"
              >
                Yes
              </button>
              <button 
                @click="showLogoutConfirm = false"
                class="px-5 py-2 border border-[#9B76DF] text-[#9B76DF] rounded-lg hover:bg-[#614594] hover:text-white transition"
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

<!-- STILURI -->
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.scale-enter-active, .scale-leave-active {
  transition: transform 0.3s ease;
}
.scale-enter-from, .scale-leave-to {
  transform: scale(0.8);
}

.fade-slide-enter-active {
  transition: all 0.6s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.8s ease forwards;
}
</style>
