import axios from 'axios';

const API_URL = 'http://localhost:3000/api/schedule';

export async function addScheduleItem(item) {
  const response = await axios.post(API_URL, item);
  return response.data;
}

export async function fetchScheduleItems(planId) {
  const response = await axios.get(API_URL, { params: { daily_plan_id: planId } });
  return response.data;
}

export async function deleteScheduleItem(id) {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}

export async function updateScheduleItem(id, updatedItem) {
  const response = await axios.put(`${API_URL}/${id}`, updatedItem);
  return response.data;
}
