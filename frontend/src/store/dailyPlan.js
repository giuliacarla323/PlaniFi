import { defineStore } from 'pinia';
import { addDailyPlan, fetchDailyPlans } from '../services/dailyPlanService';

export const useDailyPlanStore = defineStore('dailyPlan', {
  state: () => ({
    plans: [],
    loading: false,
    error: null
  }),

  actions: {
    async loadPlans(userId, date) {
      this.loading = true;
      try {
        this.plans = await fetchDailyPlans(userId, date);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async savePlan(plan) {
      try {
        const newPlan = await addDailyPlan(plan);
        this.plans.push(newPlan[0]);  // Supabase returnează array
      } catch (err) {
        this.error = err.message;
      }
    },

    // Funcția loadOrCreatePlan caută un plan existent pentru utilizator și dată. Dacă nu găsește, creează unul nou.
    async loadOrCreatePlan(userId, date) {
  this.loading = true;
  try {
    // Întotdeauna caută întâi pe server, ca să previi duplicate
    const plansFromServer = await fetchDailyPlans(userId, date);
    if (plansFromServer.length > 0) {
      // Evită duplicate în store
      const existing = this.plans.find(p => p.id === plansFromServer[0].id);
      if (!existing) {
        this.plans.push(plansFromServer[0]);
      }
      return plansFromServer[0];
    } else {
      const newPlanData = { user_id: userId, date };
      const newPlan = await addDailyPlan(newPlanData);
      this.plans.push(newPlan[0]);
      return newPlan[0];
    }
  } catch (err) {
    this.error = err.message;
  } finally {
    this.loading = false;
  }
}

    
    
  }
});
