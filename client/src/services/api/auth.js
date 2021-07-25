import axios from 'axios';

export default {
  login(email, password) {
    return axios.post('/api/login', { email, password });
  },
  editUser(id, payload) {
    return axios.put(`/api/members/${id}`, payload);
  },
  updatePassword(password) {
    return axios.put('/api/users/update-password', { password });
  },
  refreshToken() {
    return axios.get('/api/token');
  },
};
