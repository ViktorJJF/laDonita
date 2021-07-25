import axios from 'axios';

export default {
  list(query) {
    return axios.get('/api/users', { params: query });
  },
  listOne(id) {
    return axios.get('/api/users/' + id);
  },
  update(id, payload) {
    return axios.put(`/api/users/${id}`, payload);
  },
  create(payload) {
    return axios.post('/api/users', payload);
  },
  delete(id) {
    return axios.delete(`/api/users/${id}`);
  },
};
