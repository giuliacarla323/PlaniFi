// services/budget/expenseService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/expenses';

export async function fetchExpenses(budget_plan_id) {
  const response = await axios.get(API_URL, { params: { budget_plan_id } });
  return response.data;
}

export async function addExpense(expense) {
  const response = await axios.post(API_URL, expense);
  return response.data;
}

export async function updateExpense(id, expense) {
  const response = await axios.put(`${API_URL}/${id}`, expense);
  return response.data;
}

export async function deleteExpense(id) {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}
