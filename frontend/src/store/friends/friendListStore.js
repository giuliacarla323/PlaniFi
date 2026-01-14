// ✅ store/friends/friendListStore.js
import { defineStore } from 'pinia';
import { fetchFriends, removeFriend } from '../../services/friends/friendService';

export const useFriendListStore = defineStore('friendList', {
  state: () => ({
    friends: [],
    loading: false,
    error: null
  }),

  actions: {
    async loadFriends(userId) {
      this.loading = true;
      try {
        this.friends = await fetchFriends(userId);
      } catch (err) {
        this.error = err.message;
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async deleteFriend(userId, friendId) {
      try {
        await removeFriend(userId, friendId);
        this.friends = this.friends.filter(f => f.id !== friendId);
      } catch (err) {
        this.error = err.message;
        console.error(err);
        throw err;
      }
    }
  }
});