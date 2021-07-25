import { createStore } from 'vuex';
//  plugins
import modules from './modules';

export default createStore({
  modules,
  state: {
    businessImage: '/images/donitalogo.png',
    maxPaginationButtons: 15,
    itemsPerPage: 10,
    snackbar: {
      text: '',
      active: false,
      color: 'success',
    },
    toolbar: {
      drawerIcon: null,
    },
    overlay: {
      active: false,
    },
  },
  mutations: {},
  actions: {},
  getters: {
    getBusinessImage: state => state.businessImage,
  },
});
