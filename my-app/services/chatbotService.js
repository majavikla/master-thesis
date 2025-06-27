import axios from 'axios';
// om test vid mobil -> samma IP adress. hemma wifi : 192.168.0.235:300/chat
// om vid datorn och test vid datorn: http://localhost:3000/chat
const API_URL = 'http://192.168.0.235:3000/chat'; // ← Update this

export const sendMessageToChatbot = async (messages) => {
  try {
    const response = await axios.post(API_URL, { messages });
    return response.data.response;
  } catch (error) {
    console.error('Error sending message:', error);
    return 'Sorry, something went wrong.';
  }
};