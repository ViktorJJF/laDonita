import axios from 'axios';

export default {
  list(query) {
    return axios.get('/api/orders', { params: query });
  },
  listOne(id) {
    return axios.get('/api/orders/' + id);
  },
  update(id, payload) {
    return axios.put(`/api/orders/${id}`, payload);
  },
  create(payload) {
    return axios.post('/api/orders', payload);
  },
  delete(id) {
    return axios.delete(`/api/orders/${id}`);
  },
};
