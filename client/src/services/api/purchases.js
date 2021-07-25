import axios from 'axios';

export default {
  list(query) {
    return axios.get('/api/purchases', { params: query });
  },
  listOne(id) {
    return axios.get('/api/purchases/' + id);
  },
  update(id, payload) {
    return axios.put(`/api/purchases/${id}`, payload);
  },
  create(payload) {
    return axios.post('/api/purchases', payload);
  },
  delete(id) {
    return axios.delete(`/api/purchases/${id}`);
  },
};
