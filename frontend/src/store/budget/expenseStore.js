import { defineStore } from 'pinia';
import {
  fetchExpenses,
  addExpense,
  updateExpense,
  deleteExpense
} from '../../services/budget/expenseService';

export const useExpenseStore = defineStore('expense', {
  state: () => ({
    expenses: [],
    loading: false,
    error: null
  }),

  actions: {
    async loadExpenses(budgetPlanId) {
      this.loading = true;
      try {
        this.expenses = await fetchExpenses(budgetPlanId);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async createExpense(expense) {
      const res = await addExpense(expense);
      this.expenses.push(res[0]);
    },

    async editExpense(id, updated) {
      const res = await updateExpense(id, updated);
      const idx = this.expenses.findIndex(e => e.id === id);
      if (idx !== -1) this.expenses[idx] = res[0];
    },

    async removeExpense(id) {
      await deleteExpense(id);
      this.expenses = this.expenses.filter(e => e.id !== id);
    }
  }
});
