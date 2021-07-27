// usar esto para paginacion con servidor
import api from '@/services/api/notes';
import {
  buildSuccess,
  handleError,
  buildQueryWithPagination,
} from '@/utils/utils';

const module = {
  namespaced: true,
  state: {
    notes: [],
    total: 0,
    totalPages: 0,
  },
  actions: {
    list({ commit }, query) {
      const finalQuery = buildQueryWithPagination(query);
      return new Promise((resolve, reject) => {
        api
          .list(finalQuery)
          .then(response => {
            commit('list', response.data.payload);
            commit('totalItems', response.data.totalDocs);
            commit('totalPages', response.data.totalPages);
            resolve(response.data.payload);
          })
          .catch(error => {
            handleError(error, commit, reject);
          });
      });
    },
    listOne({ commit }, id) {
      return new Promise((resolve, reject) => {
        api
          .listOne(id)
          .then(response => {
            resolve(response.data.payload);
          })
          .catch(error => {
            handleError(error, commit, reject);
          });
      });
    },
    create({ commit }, data) {
      return new Promise((resolve, reject) => {
        api
          .create(data)
          .then(res => {
            commit('create', res.data.payload);
            resolve(res.data.payload);
          })
          .catch(error => {
            handleError(error, commit, reject);
          });
      });
    },
    update({ commit }, { id, data }) {
      return new Promise((resolve, reject) => {
        api
          .update(id, data)
          .then(res => {
            commit('update', {
              id,
              data: res.data.payload,
            });
            resolve(res.data.payload);
          })
          .catch(error => {
            handleError(error, commit, reject);
          });
      });
    },
    delete({ commit }, id) {
      return new Promise((resolve, reject) => {
        api
          .delete(id)
          .then(() => {
            buildSuccess('Registro eliminado con éxito', commit);
            commit('delete', id);
            resolve();
          })
          .catch(error => {
            handleError(error, commit, reject);
          });
      });
    },
  },
  mutations: {
    list(state, data) {
      state.notes = data;
    },
    totalItems(state, data) {
      state.total = data;
    },
    totalPages(state, data) {
      state.totalPages = data;
    },
    create(state, data) {
      state.notes.unshift(data);
    },
    update(state, { id, data }) {
      const indexToUpdate = state.notes.findIndex(member => member.id === id);
      state.notes.splice(indexToUpdate, 1, {
        ...data,
      });
    },
    delete(state, id) {
      const indexToDelete = state.notes.findIndex(member => member.id === id);
      state.notes.splice(indexToDelete, 1);
    },
  },
  getters: {},
};

export default module;
