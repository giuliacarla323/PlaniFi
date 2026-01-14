<template>
  <div class="flex h-screen bg-gradient-to-br from-[#b4f2c6] via-[#94e9e8] to-[#f0cod5] text-gray-800">
    <!-- Sidebar -->
    <div
      :class="[
        'bg-[#135B5A] text-white p-4 transition-all duration-300 overflow-hidden',
        sidebarOpen ? 'w-64' : 'w-0'
      ]"
    >
      <div v-if="sidebarOpen" class="space-y-4 mt-10">
        <img :src="logobej" alt="PlaniFi Logo Bej" class=" h-40 w-auto mx-auto" />
        <RouterLink to="/home" class="block hover:text-blue-300 cursor-pointer">🏠 Home</RouterLink>
        <RouterLink to="/planner" class="block hover:text-blue-300"> 🗓️ Task Manager </RouterLink>
        <RouterLink to="/budget" class="block hover:text-blue-300 cursor-pointer">💰 Budget Planner</RouterLink>
        <RouterLink to="/split" class="block hover:text-blue-300 cursor-pointer">🧾 Split</RouterLink>
           
        <button
          @click="goTo('/')"
          class="text-[#fefefe] rounded-lg hover:bg-[#115251] hover:text-white transition cursor-pointer"
        >
          ❌ Log Out
        </button>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex flex-col flex-1 overflow-y-auto">
      <!-- Top bar with toggle -->
      <div class="p-4">
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="p-2 bg-[#135B5A] text-white hover:bg-[#6EC0CD] rounded cursor-pointer"
        >
          {{ sidebarOpen ? '❌ Close' : '📂 Menu' }}
        </button>
      </div>

      <!-- Account content -->
      <main class="flex-1 px-6 pb-10">
        <div class="max-w-5xl mx-auto space-y-10">
          <h1 class="text-3xl lg:text-4xl font-bold text-[#115251]">👤 My Account</h1>

          <!-- User info -->
          <div class="bg-white p-6 rounded-xl shadow-md">
            <p class="text-lg"><strong>Username:</strong> {{ user?.username }}</p>
            <p class="text-lg"><strong>Email:</strong> {{ user?.email }}</p>

            <!-- Change password button -->
            <button
              @click="goTo('/reset-password')"
              class="mt-4 bg-[#177170] text-white px-4 py-2 rounded-lg hover:bg-[#115251] transition cursor-pointer"
            >
              🔐 Change Password
            </button>
          </div>

          <!-- Friends list -->
          <div class="bg-white p-6 rounded-xl shadow-md">
            <h2 class="text-xl font-semibold text-[#177170] mb-4">👥 My Friends</h2>
            <div v-if="loadingFriends" class="text-gray-500">Loading friends...</div>
            <ul v-else-if="friends.length" class="space-y-2">
              <li
                v-for="friend in friends"
                :key="friend.id"
                class="bg-gray-50 p-4 rounded-xl shadow border border-gray-200"
              >
                <div class="font-medium text-gray-800">{{ friend.username }}</div>
                <div class="text-sm text-gray-500">{{ friend.email }}</div>
              </li>
            </ul>
            <div v-else class="text-gray-500 italic">No friends yet.</div>
          </div>

          <!-- Send Friend Request -->
          <div class="bg-white p-6 rounded-xl shadow-md mt-6">
            <h2 class="text-xl font-semibold text-[#177170] mb-4">➕ Send Friend Request</h2>
            <form @submit.prevent="submit" class="space-y-4">
              <input
                v-model="email"
                type="email"
                placeholder="Enter friend's email"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#177170]"
                required
              />
              <button
                type="submit"
                class="px-4 py-2 bg-[#177170] text-white rounded-lg hover:bg-[#115251] transition cursor-pointer"
              >
                ➕ Send Request
              </button>
            </form>
          </div>

          <FriendRequests @friendAccepted="reloadFriends" />

        </div>
      </main>

      <!-- Footer -->
      <footer class="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4 border-t-2 border-[#96e2e1] bg-[#cde8e7] shadow-inner text-sm md:text-base text-[#177170]">
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

    <!-- Friend Request Confirmation Modal -->
    <transition name="fade">
      <div v-if="showSendConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <transition name="scale">
          <div class="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
            <h3 class="text-2xl text-[#134F5E] font-semibold mb-6">Friend Request</h3>
            <p class="mb-6">{{ confirmationMessage }}</p>
            <button
              @click="showSendConfirm = false"
              class="px-5 py-2 bg-[#134F5E] text-white rounded-lg hover:bg-[#6EC0CD] transition cursor-pointer"
            >
              OK
            </button>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../store/user';
import { useFriendListStore } from '../../store/friends/friendListStore';
import { useFriendRequestStore } from '../../store/friends/friendRequestStore';
import FriendRequests from '../../components/Friends/FriendRequests.vue';
import logobej from '../../assets/planifibej.png';
import logoAlbastru from '../../assets/planifialbastru.png';
import axios from 'axios';

const router = useRouter();
defineProps();

const userStore = useUserStore();
const friendStore = useFriendListStore();
const requestStore = useFriendRequestStore();

const sidebarOpen = ref(true);
const showLogoutConfirm = ref(false);
const showSendConfirm = ref(false);
const confirmationMessage = ref('');

const user = computed(() => userStore.user);
const friends = computed(() => friendStore.friends);
const requests = computed(() => requestStore.requests);
const loadingFriends = computed(() => friendStore.loading);
const loadingRequests = computed(() => requestStore.loading);

onMounted(async () => {
  userStore.loadUser();
  if (user.value?.id) {
    await friendStore.loadFriends(user.value.id);
    await requestStore.loadRequests(user.value.id);
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
  localStorage.removeItem('user');
  showLogoutConfirm.value = false;
  router.push('/');
}
const reloadFriends = async () => {
  if (user.value?.id) {
    await friendStore.loadFriends(user.value.id);
  }
};


const email = ref('');

const submit = async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/api/users/find-by-email', {
      params: { email: email.value }
    });

    const receiver_id = data?.id;
    if (!receiver_id) {
      confirmationMessage.value = '❌ User not found';
      showSendConfirm.value = true;
      return;
    }

    await requestStore.sendFriendRequest(user.value.id, receiver_id);
    confirmationMessage.value = `✅ Friend request sent to ${data.username || data.email}!`;
    showSendConfirm.value = true;
    email.value = '';
  } catch (err) {
    confirmationMessage.value = `❌ Error: ${err.message}`;
    showSendConfirm.value = true;
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.3s ease;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0.95);
}
</style>
