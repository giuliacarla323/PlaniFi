import { defineStore } from 'pinia';
import {
  addCallItem,
  fetchCallItems,
  deleteCallItem,
  updateCallItem
} from '../services/callServices';

export const useCallStore = defineStore('call', {
  state: () => ({
    calls: [],
    loading: false,
    error: null
  }),

  actions: {
    async loadCalls(planId) {
      this.loading = true;
      try {
        this.calls = await fetchCallItems(planId);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async saveCall(item) {
      try {
        const saved = await addCallItem(item);
        this.calls.push(saved[0]);
      } catch (err) {
        this.error = err.message;
      }
    },

    async removeCall(id) {
      try {
        await deleteCallItem(id);
        this.calls = this.calls.filter(call => call.id !== id);
      } catch (err) {
        this.error = err.message;
      }
    },

    async editCall(id, updated) {
      try {
        const updatedItem = await updateCallItem(id, updated);
        const index = this.calls.findIndex(i => i.id === id);
        if (index !== -1) this.calls[index] = updatedItem[0];
      } catch (err) {
        this.error = err.message;
      }
    }
  }
});
