<template>
  <div class="space-y-6 mt-6">
    <h3 class="text-xl font-semibold text-[#177170]">👥 Friend Requests</h3>

    <div v-if="loading" class="text-gray-500">Loading...</div>

    <ul v-else>
      <li
        v-for="req in requests"
        :key="req.id"
        class="bg-white p-4 rounded-xl shadow-md border border-gray-200"
      >
        <div class="flex justify-between items-center">
          <span class="text-[#115251] font-medium">
            {{ req.users?.username || req.users?.email || 'Unknown User' }}
          </span>

          <div class="space-x-3">
            <button
              @click="accept(req.id)"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 cursor-pointer"
            >
              Accept
            </button>
            <button
              @click="decline(req.id)"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 cursor-pointer"
            >
              Decline
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useFriendRequestStore } from '../../store/friends/friendRequestStore';
import { useUserStore } from '../../store/user';

// Emitere evenimente către componenta părinte
const emit = defineEmits(['friendAccepted']);

const friendStore = useFriendRequestStore();
const userStore = useUserStore();

const requests = computed(() => friendStore.requests);
const loading = computed(() => friendStore.loading);

onMounted(() => {
  if (userStore.user?.id) {
    friendStore.loadRequests(userStore.user.id);
  }
});

const accept = async (id) => {
  await friendStore.accept(id);
  emit('friendAccepted'); // 🔁 Anunță componenta părinte să reîncarce lista de prieteni
};

const decline = async (id) => {
  await friendStore.decline(id);
};
</script>

<style scoped>
ul li {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

ul li:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

button {
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button:hover {
  transform: translateY(-2px);
}

.bg-white:hover {
  background-color: #f9f9f9;
}
</style>
