import { defineStore } from 'pinia';
import {
  fetchUserExpenses,
  fetchGroupExpenses,
  createSharedExpense,
  updateSharedExpense,
  deleteSharedExpense,
  settleSharedExpense
} from '../../services/friends/sharedExpenseService';

export const useSharedExpenseStore = defineStore('sharedExpenseStore', {
  state: () => ({
    allExpenses: [], // ✅ toate cheltuielile (individuale + grup)
   groupExpenses: {}, // ✅ doar cele pentru un grup specific
    loading: false,
    error: null
  }),

  actions: {
    async loadUserExpenses(userId) {
      this.loading = true;
      this.error = null;
      try {
        const data = await fetchUserExpenses(userId);
        this.allExpenses = data; // ✅ toată lista vine direct
      } catch (err) {
        this.error = err.message;
        this.allExpenses = [];
        console.error('Error loading user expenses:', err);
      } finally {
        this.loading = false;
      }
    },

     async loadGroupExpenses(groupId) {
      this.loading = true;
      this.error = null;
      try {
        const data = await fetchGroupExpenses(groupId);
        this.groupExpenses[groupId] = data;  // ✅ salvezi sub cheie
      } catch (err) {
        this.error = err.message;
        console.error('Error loading group expenses:', err);
      } finally {
        this.loading = false;
      }
    },

    async addExpense(expenseData) {
      try {
        const newExpense = await createSharedExpense(expenseData);
        this.allExpenses.unshift(newExpense);

        if (expenseData.group_id) {
          const groupId = expenseData.group_id;
          this.groupExpenses[groupId] = [
            newExpense,
            ...(this.groupExpenses[groupId] || [])
          ];
        }
      } catch (err) {
        this.error = err.message;
        console.error('Error adding shared expense:', err);
      }
    },


    async updateExpense(expense_id, updatedFields) {
      try {
        const updated = await updateSharedExpense(expense_id, updatedFields);
        this.allExpenses = this.allExpenses.map(e => e.id === expense_id ? updated : e);
        this.groupExpenses = this.groupExpenses.map(e => e.id === expense_id ? updated : e);
        return updated;
      } catch (err) {
        this.error = err.message;
        console.error('Error updating expense:', err);
        throw err;
      }
    },

    async deleteExpense(expense_id) {
  try {
    await deleteSharedExpense(expense_id); // API call

    this.allExpenses = this.allExpenses.filter(e => e.id !== expense_id);

    for (const groupId in this.groupExpenses) {
      const expenses = this.groupExpenses[groupId];
      if (!Array.isArray(expenses)) continue;

      const index = expenses.findIndex(e => e.id === expense_id);
      if (index !== -1) {
        this.groupExpenses[groupId] = expenses.filter(e => e.id !== expense_id);
        break; // o singură dată, dacă ai doar un grup cu expense-ul ăsta
      }
    }

  } catch (err) {
    this.error = err.message;
    console.error('Error deleting expense:', err);
    throw err;
  }
},


    async settleExpense(expense_id) {
      try {
        await settleSharedExpense(expense_id);
        // Poți marca cheltuiala ca `settled` local:
        this.allExpenses = this.allExpenses.map(e =>
          e.id === expense_id ? { ...e, settled: true } : e
        );
        for (const groupId in this.groupExpenses) {
  const expenses = this.groupExpenses[groupId];
  if (!Array.isArray(expenses)) continue;

  const index = expenses.findIndex(e => e.id === expense_id);
  if (index !== -1) {
    // Clonează lista și actualizează elementul specific
    const updatedExpenses = [...expenses];
    updatedExpenses[index] = { ...updatedExpenses[index], settled: true };
    this.groupExpenses[groupId] = updatedExpenses;
    break; // o singură dată
  }
}

      } catch (err) {
        this.error = err.message;
        console.error('Error settling expense:', err);
        throw err;
      }
    }
  }
});
