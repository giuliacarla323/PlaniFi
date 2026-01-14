// services/budget/incomeService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/income';

export async function fetchIncomes(budget_plan_id) {
  const response = await axios.get(API_URL, { params: { budget_plan_id } });
  return response.data;
}

export async function addIncome(income) {
  const response = await axios.post(API_URL, income);
  return response.data;
}

export async function updateIncome(id, income) {
  const response = await axios.put(`${API_URL}/${id}`, income);
  return response.data;
}

export async function deleteIncome(id) {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}
