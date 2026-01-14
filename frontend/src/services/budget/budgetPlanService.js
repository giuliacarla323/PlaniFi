// services/budgetPlanService.js

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/budget-plans';

export async function addBudgetPlan(plan) {
  try {
    const response = await axios.post(API_URL, plan);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Eroare la salvarea planului bugetar.');
  }
}

export async function fetchBudgetPlan(userId, month) {
  try {
    const response = await axios.get(API_URL, {
      params: { user_id: userId, month }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Eroare la obținerea planului bugetar.');
  }
}
