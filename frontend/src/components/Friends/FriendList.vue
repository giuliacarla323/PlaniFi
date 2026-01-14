// ✅ FriendList.vue
<template>
  <div>
    <h3 class="text-xl font-semibold text-[#21371C] mb-4">👥 My Friends</h3>

    <ul v-if="friends.length">
      <li
        v-for="friend in friends"
        :key="friend.id"
        class="flex justify-between items-center border rounded px-4 py-3 mb-2 bg-white shadow-sm"
      >
        <div>
          <p class="font-medium text-[#21371C]">{{ friend.username || 'Unnamed User' }}</p>
          <p class="text-sm text-gray-500">{{ friend.email }}</p>
        </div>
        <button
          @click="deleteFriend(friend.id)"
          class="text-red-500 text-sm hover:underline"
        >
          ❌ Remove
        </button>
      </li>
    </ul>

    <p v-else class="text-gray-500">No friends yet.</p>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useFriendListStore } from '../../store/friends/friendListStore';
import { useUserStore } from '../../store/user';

const userStore = useUserStore();
const friendStore = useFriendListStore();

const friends = computed(() => friendStore.friends);
const userId = computed(() => userStore.user?.id);

async function deleteFriend(friendId) {
  if (confirm('Are you sure?')) {
    await friendStore.deleteFriend(userId.value, friendId);
    friendStore.friends = friendStore.friends.filter(f => f.id !== friendId);
  }
}

onMounted(() => {
  if (userId.value) {
    friendStore.loadFriends(userId.value);
  }
});
</script>