import axios from 'axios';

export async function fetchDailyQuote() {
    const response = await axios.get('http://localhost:3000/api/quotes');
  return response.data;
}
