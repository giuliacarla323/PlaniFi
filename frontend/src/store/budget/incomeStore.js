import { defineStore } from 'pinia';
import { fetchIncomes, addIncome, updateIncome, deleteIncome } from '../../services/budget/incomeService';

export const useIncomeStore = defineStore('income', {
  state: () => ({
    incomes: [],
    loading: false,
    error: null
  }),

  actions: {
    async loadIncomes(planId) {
      this.loading = true;
      try {
        this.incomes = await fetchIncomes(planId);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async createIncome(income) {
      try {
        const newIncome = await addIncome(income);
        this.incomes.push(newIncome);
      } catch (err) {
        this.error = err.message;
        throw err;
      }
    },

    async editIncome(id, income) {
      try {
        const updated = await updateIncome(id, income);
        const index = this.incomes.findIndex(i => i.id === id);
        if (index !== -1) this.incomes[index] = updated;
      } catch (err) {
        this.error = err.message;
        throw err;
      }
    },

    async removeIncome(id) {
      try {
        await deleteIncome(id);
        this.incomes = this.incomes.filter(i => i.id !== id);
      } catch (err) {
        this.error = err.message;
        throw err;
      }
    }
  }
});
