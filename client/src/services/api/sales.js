import axios from 'axios';

export default {
  list(query) {
    return axios.get('/api/sales', { params: query });
  },
  listOne(id) {
    return axios.get('/api/sales/' + id);
  },
  update(id, payload) {
    return axios.put(`/api/sales/${id}`, payload);
  },
  create(payload) {
    return axios.post('/api/sales', payload);
  },
  delete(id) {
    return axios.delete(`/api/sales/${id}`);
  },
};
