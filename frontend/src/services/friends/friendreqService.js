import axios from 'axios';

const API_URL = 'http://localhost:3000/api/friend-requests';

export async function sendRequest(payload) {
  const res = await axios.post(API_URL, payload);
  return res.data;
}

export async function getRequests(user_id) {
  const res = await axios.get(API_URL, { params: { user_id } });
  return res.data;
}

export async function acceptRequest(id) {
  const res = await axios.post(`${API_URL}/${id}/accept`);
  return res.data;
}

export async function declineRequest(id) {
  const res = await axios.post(`${API_URL}/${id}/decline`);
  return res.data;
}
