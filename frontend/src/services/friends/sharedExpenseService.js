// services/friends/sharedExpenseService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/shared-expenses';

export async function fetchUserExpenses(user_id) {
  const response = await axios.get(`${API_URL}/user/${user_id}`);
  return response.data;
}

export async function fetchGroupExpenses(group_id) {
  const response = await axios.get(`${API_URL}/group/${group_id}`);
  return response.data;
}

export async function createSharedExpense(expense) {
  const response = await axios.post(API_URL, expense);
  return response.data;
}

export async function updateSharedExpense(expense_id, updatedFields) {
  const response = await axios.put(`${API_URL}/${expense_id}`, updatedFields);
  return response.data;
}

export async function deleteSharedExpense(expense_id) {
  const response = await axios.delete(`${API_URL}/${expense_id}`);
  return response.data;
}

export async function settleSharedExpense(expense_id) {
  const response = await axios.post(`${API_URL}/${expense_id}/settle`);
  return response.data;
}
