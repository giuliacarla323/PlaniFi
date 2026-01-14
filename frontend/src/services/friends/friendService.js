import axios from 'axios';

const API_URL = 'http://localhost:3000/api/friends';

export async function fetchFriends(userId) {
  const response = await axios.get(API_URL, { params: { user_id: userId } });
  return response.data;
}

export async function removeFriend(userId, friendId) {
  const response = await axios.delete(API_URL, { data: { user_id: userId, friend_id: friendId } });
  return response.data;
}
