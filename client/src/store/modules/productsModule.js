// usar esto para paginacion con servidor
import api from '@/services/api/products';
import {
  buildSuccess,
  handleError,
  buildQueryWithPagination,
} from '@/utils/utils';

const module = {
  namespaced: true,
  state: {
    products: [],
    total: 0,
    totalPages: 0,
  },
  actions: {
    list({ commit }, query) {
      const finalQuery = buildQueryWithPagination(query);
      const { showLoading } = query;
      if (showLoading) {
        commit('loadingModule/showLoading', true, { root: true });
      }
      return new Promise((resolve, reject) => {
        api
          .list(finalQuery)
          .then(response => {
            // agregando campo para busqueda name-brand
            let docs = response.data.payload.map(el => ({
              ...el,
              productWithBrand:
                el.name + (el.brandId ? ' ' + el.brand.name : ''),
            }));
            commit('list', docs);
            commit('totalItems', response.data.totalDocs);
            commit('totalPages', response.data.totalPages);
            resolve(docs);
            if (showLoading) {
              commit('loadingModule/showLoading', false, { root: true });
            }
          })
          .catch(error => {
            console.log('🚀 Aqui *** -> error', error);
            handleError(error, commit, reject);
          });
      });
    },
    listDistinct({ commit }, query) {
      const finalQuery = buildQueryWithPagination(query);
      const { showLoading } = query;
      if (showLoading) {
        commit('loadingModule/showLoading', true, { root: true });
      }
      return new Promise((resolve, reject) => {
        api
          .listDistinct(finalQuery)
          .then(response => {
            resolve(response.data.payload);
            if (showLoading) {
              commit('loadingModule/showLoading', false, { root: true });
            }
          })
          .catch(error => {
            handleError(error, commit, reject);
          });
      });
    },
    listOne({ commit }, id) {
      commit('loadingModule/showLoading', true, { root: true });
      return new Promise((resolve, reject) => {
        api
          .listOne(id)
          .then(response => {
            resolve(response.data.payload);
            commit('loadingModule/showLoading', false, { root: true });
          })
          .catch(error => {
            handleError(error, commit, reject);
          });
      });
    },
    create({ commit }, data) {
      return new Promise((resolve, reject) => {
        commit('loadingModule/showLoading', true, { root: true });
        api
          .create(data)
          .then(res => {
            commit('loadingModule/showLoading', false, { root: true });
            buildSuccess('Registro guardado con éxito', commit);
            commit('create', res.data.payload);
            resolve(res.data.payload);
          })
          .catch(error => {
            handleError(error, commit, reject);
          });
      });
    },
    update({ commit }, { id, data }) {
      commit('loadingModule/showLoading', true, { root: true });
      return new Promise((resolve, reject) => {
        api
          .update(id, data)
          .then(res => {
            commit('loadingModule/showLoading', false, { root: true });
            buildSuccess('Registro actualizado con éxito', commit);
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
        commit('loadingModule/showLoading', true, { root: true });
        api
          .delete(id)
          .then(() => {
            commit('loadingModule/showLoading', false, { root: true });
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
      state.products = data;
    },
    totalItems(state, data) {
      state.total = data;
    },
    totalPages(state, data) {
      state.totalPages = data;
    },
    create(state, data) {
      state.products.unshift(data);
    },
    update(state, { id, data }) {
      const indexToUpdate = state.products.findIndex(
        member => member.id === id,
      );
      state.products.splice(indexToUpdate, 1, {
        ...data,
      });
    },
    delete(state, id) {
      const indexToDelete = state.products.findIndex(
        member => member.id === id,
      );
      state.products.splice(indexToDelete, 1);
    },
  },
  getters: {
    searchProduct: state => search => {
      console.log('🚀 Aqui *** -> search', search);
      return search.trim().length > 0
        ? state.products.filter(item =>
            [...Object.keys(item)].some(
              key =>
                (typeof item[key] === 'string' ||
                  typeof item[key] === 'number') &&
                String(item[key])
                  .toLowerCase()
                  .includes(search.toLowerCase().trim()),
            ),
          )
        : state.products;
    },
  },
};

export default module;
