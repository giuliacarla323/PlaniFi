import { defineStore } from 'pinia';
import {
  fetchBudgets,
  createBudget,
  updateBudget,
  deleteBudget
} from '../../services/budget/budgetService';

export const useBudgetStore = defineStore('budget', {
  state: () => ({
    budgets: [],
    loading: false,
    error: null
  }),

  getters: {
    mainBudget(state) {
      return state.budgets.find(b => b.category === 'Main')?.amount || 0;
    },
    totalOtherBudgets(state) {
      return state.budgets
        .filter(b => b.category !== 'Main')
        .reduce((sum, b) => sum + (b.amount || 0), 0);
    }
  },

  actions: {
    async loadBudgets(planId) {
      this.loading = true;
      try {
        this.budgets = await fetchBudgets(planId);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async saveBudget(budget) {
      const existing = this.budgets.find(b => b.category === budget.category);

      if (existing) {
        const updated = await updateBudget(existing.id, budget);
        const index = this.budgets.findIndex(b => b.id === existing.id);
        if (index !== -1) this.budgets[index] = updated;
      } else {
        const created = await createBudget(budget);
        this.budgets.push(created);
      }
    },

    async removeBudget(id) {
      try {
        await deleteBudget(id);
        this.budgets = this.budgets.filter(b => b.id !== id);
      } catch (err) {
        this.error = err.message;
      }
    }
  }
});
