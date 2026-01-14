import { defineStore } from 'pinia';
import {
  addScheduleItem,
  fetchScheduleItems,
  deleteScheduleItem,
  updateScheduleItem
} from '../services/scheduleService';

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),

  actions: {
    async loadScheduleItems(planId) {
      this.loading = true;
      try {
        this.items = await fetchScheduleItems(planId);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async saveScheduleItem(item) {
      try {
        const saved = await addScheduleItem(item);
        this.items.push(saved[0]);
      } catch (err) {
        this.error = err.message;
      }
    },

    async removeScheduleItem(id) {
      try {
        await deleteScheduleItem(id);
        this.items = this.items.filter(item => item.id !== id);
      } catch (err) {
        this.error = err.message;
      }
    },

    async editScheduleItem(id, updated) {
      try {
        const updatedItem = await updateScheduleItem(id, updated);
        const index = this.items.findIndex(i => i.id === id);
        if (index !== -1) this.items[index] = updatedItem;
      } catch (err) {
        this.error = err.message;
      }
    }
  }
});
