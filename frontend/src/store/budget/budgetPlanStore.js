import { defineStore } from 'pinia';
import { addBudgetPlan, fetchBudgetPlan } from '../../services/budget/budgetPlanService';

export const useBudgetPlanStore = defineStore('budgetPlan', {
  state: () => ({
    plans: [],
    loading: false,
    error: null,
    _pending: new Map()
  }),

  actions: {
    async loadOrCreatePlan(userId, month) {
      this.loading = true;
      this.error = null;

      const formattedMonth = `${month}-01`;
      const key = `${userId}-${formattedMonth}`;

      // Dacă deja există o promisiune în curs, returneaz-o
      if (this._pending.has(key)) {
        return this._pending.get(key);
      }

      const promise = (async () => {
        // Verifică local
        const existing = this.plans.find(p => p.month === formattedMonth && p.user_id === userId);
        if (existing) return existing;

        // Verifică server
        const serverPlans = await fetchBudgetPlan(userId, formattedMonth);
        if (serverPlans.length > 0) {
          this.plans.push(...serverPlans);
          return serverPlans[0];
        }

        // Creează dacă nu există
        const newPlan = await addBudgetPlan({ user_id: userId, month: formattedMonth });
        this.plans.push(newPlan[0]);
        return newPlan[0];
      })();

      // Salvează promisiunea temporar
      this._pending.set(key, promise);

      try {
        const result = await promise;
        return result;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this._pending.delete(key);
        this.loading = false;
      }
    }
  }
});
