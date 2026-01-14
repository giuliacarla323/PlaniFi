import axios from 'axios';

const API_URL = 'http://localhost:3000/api/groups';

export async function createGroup(groupData) {
  const response = await axios.post(API_URL, groupData);
  return response.data;
}

export async function addGroupMember(group_id, user_id) {
  const response = await axios.post(`${API_URL}/${group_id}/members`, { user_id });
  return response.data;
}

export async function removeGroupMember(group_id, user_id) {
  const response = await axios.delete(`${API_URL}/${group_id}/members/${user_id}`);
  return response.data;
}

export async function fetchGroupMembers(group_id) {
  const response = await axios.get(`${API_URL}/${group_id}/members`);
  return response.data;
}

export async function fetchGroupsForUser(user_id) {
  const response = await axios.get(`${API_URL}/for-user/${user_id}`);
  return response.data;
}
