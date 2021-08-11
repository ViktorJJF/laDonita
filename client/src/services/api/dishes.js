import axios from 'axios';

export default {
  list(query) {
    return axios.get('/api/dishes', { params: query });
  },
  listOne(id) {
    return axios.get('/api/dishes/' + id);
  },
  update(id, payload) {
    return axios.put(`/api/dishes/${id}`, payload);
  },
  create(payload) {
    return axios.post('/api/dishes', payload);
  },
  delete(id) {
    return axios.delete(`/api/dishes/${id}`);
  },
};
