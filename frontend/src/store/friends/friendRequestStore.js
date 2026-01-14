// ✅ store/friends/friendRequestStore.js
import { defineStore } from 'pinia';
import {
  sendRequest,
  getRequests,
  acceptRequest,
  declineRequest
} from '../../services/friends/friendreqService';

export const useFriendRequestStore = defineStore('friendRequest', {
  state: () => ({
    requests: [],
    loading: false,
    error: null
  }),

  actions: {
    async loadRequests(userId) {
      this.loading = true;
      try {
        this.requests = await getRequests(userId);
      } catch (err) {
        this.error = err.message;
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async sendFriendRequest(sender_id, receiver_id) {
      try {
        await sendRequest({ sender_id, receiver_id });
      } catch (err) {
        this.error = err.message;
        console.error(err);
        throw err;
      }
    },

    async accept(id) {
      try {
        await acceptRequest(id);
        this.requests = this.requests.filter(r => r.id !== id);
      } catch (err) {
        console.error(err);
        this.error = err.message;
      }
    },

    async decline(id) {
      try {
        await declineRequest(id);
        this.requests = this.requests.filter(r => r.id !== id);
      } catch (err) {
        console.error(err);
        this.error = err.message;
      }
    }
  }
});
