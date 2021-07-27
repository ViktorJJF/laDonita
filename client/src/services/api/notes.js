import axios from 'axios';

export default {
  list(query) {
    return axios.get('/api/notes', { params: query });
  },
  listOne(id) {
    return axios.get('/api/notes/' + id);
  },
  update(id, payload) {
    return axios.put(`/api/notes/${id}`, payload);
  },
  create(payload) {
    return axios.post('/api/notes', payload);
  },
  delete(id) {
    return axios.delete(`/api/notes/${id}`);
  },
};
