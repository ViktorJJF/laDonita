import axios from 'axios';

export default {
  list(query) {
    delete query['showLoading'];
    return axios.get('/api/products', { params: query });
  },
  listDistinct(query) {
    delete query['showLoading'];
    return axios.get('/api/products/distinct', { params: query });
  },
  listOne(id) {
    return axios.get('/api/products/' + id);
  },
  update(id, payload) {
    return axios.put(`/api/products/${id}`, payload);
  },
  create(payload) {
    return axios.post('/api/products', payload);
  },
  delete(id) {
    return axios.delete(`/api/products/${id}`);
  },
};
