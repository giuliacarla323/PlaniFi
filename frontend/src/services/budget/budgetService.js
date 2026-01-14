// services/budget/budgetService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/budget';

export async function fetchBudgets(budget_plan_id) {
  try {
    const response = await axios.get(API_URL, {
      params: { budget_plan_id }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Eroare la obținerea bugetelor.');
  }
}

export async function createBudget(budget) {
  try {
    const response = await axios.post(API_URL, budget);
    return response.data[0]; // Supabase într-un array
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Eroare la crearea bugetului.');
  }
}

export async function updateBudget(id, budget) {
  try {
    const response = await axios.put(`${API_URL}/${id}`, budget);
    return response.data[0];
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Eroare la actualizarea bugetului.');
  }
}

export async function deleteBudget(id) {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Eroare la ștergerea bugetului.');
  }
}
