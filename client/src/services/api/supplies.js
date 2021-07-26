import axios from 'axios';

export default {
  list(query) {
    return axios.get('/api/supplies', { params: query });
  },
  listOne(id) {
    return axios.get('/api/supplies/' + id);
  },
  update(id, payload) {
    return axios.put(`/api/supplies/${id}`, payload);
  },
  create(payload) {
    return axios.post('/api/supplies', payload);
  },
  delete(id) {
    return axios.delete(`/api/supplies/${id}`);
  },
};
