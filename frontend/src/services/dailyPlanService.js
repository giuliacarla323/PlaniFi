// dailyPlanService.js

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/dailyplans';

export async function addDailyPlan(plan) {
  try {
    const response = await axios.post(API_URL, plan);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Eroare la salvarea planului.');
  }
}

export async function fetchDailyPlans(userId, date) {
  try {
    const response = await axios.get(API_URL, {
      params: { user_id: userId, date: date }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Eroare la obținerea planurilor.');
  }
}
