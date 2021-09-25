import { createStore } from 'vuex';
//  plugins
import modules from './modules';

export default createStore({
  modules,
  state: {
    business: 'FIXTECBAR',
    subMessage: '',
    businessImage: '/images/fixtec.jpg',
    maxPaginationButtons: 15,
    itemsPerPage: 15,
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
