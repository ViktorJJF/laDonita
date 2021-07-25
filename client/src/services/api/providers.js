import axios from 'axios';

export default {
  list(query) {
    return axios.get('/api/providers', { params: query });
  },
  listOne(id) {
    return axios.get('/api/providers/' + id);
  },
  update(id, payload) {
    return axios.put(`/api/providers/${id}`, payload);
  },
  create(payload) {
    return axios.post('/api/providers', payload);
  },
  delete(id) {
    return axios.delete(`/api/products/${id}`);
  },
};
