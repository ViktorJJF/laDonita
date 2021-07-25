import api from '@/services/api/auth';
import apiUsers from '@/services/api/users';
import { buildSuccess, handleError } from '@/utils/utils';
import router from '@/router';

const module = {
  namespaced: true,
  state: {
    user: null,
    token: JSON.parse(!!localStorage.getItem('token')) || null,
    isTokenSet: !!localStorage.getItem('token'),
  },
  actions: {
    initialLoad({ commit }) {
      if (process.browser) {
        commit('initialLoad');
      }
    },
    login({ commit }, { email, password }) {
      return new Promise((resolve, reject) => {
        commit('loadingModule/showLoading', true, { root: true });
        api
          .login(email, password)
          .then(response => {
            if (response.status === 200) {
              localStorage.setItem('user', JSON.stringify(response.data.user));
              localStorage.setItem('token', response.data.token);
              // window.localStorage.setItem(
              //   "tokenExpiration",
              //   JSON.stringify(
              //     format(
              //       addMinutes(new Date(), MINUTES_TO_CHECK_FOR_TOKEN_REFRESH),
              //       "X"
              //     )
              //   )
              // );
              commit('saveUser', response.data.user);
              commit('saveToken', response.data.token);
              // commit(types.EMAIL_VERIFIED, response.data.user.verified);
              buildSuccess('Bienvenido', commit);
              resolve();
            }
          })
          .catch(error => {
            handleError(error, commit, reject);
          });
      });
    },
    refreshToken({ commit }) {
      return new Promise((resolve, reject) => {
        api
          .refreshToken()
          .then(response => {
            if (response.status === 200) {
              window.localStorage.setItem(
                'token',
                JSON.stringify(response.data.token),
              );
              // window.localStorage.setItem(
              //   "tokenExpiration",
              //   JSON.stringify(
              //     format(
              //       addMinutes(new Date(), MINUTES_TO_CHECK_FOR_TOKEN_REFRESH),
              //       "X"
              //     )
              //   )
              // );
              commit('saveToken', response.data.token);
              resolve();
            }
          })
          .catch(error => {
            handleError(error, commit, reject);
          });
      });
    },
    autoLogin({ commit }) {
      const user = JSON.parse(localStorage.getItem('user'));
      commit('saveUser', user);
      commit('saveToken', localStorage.getItem('token'));
      // commit(types.EMAIL_VERIFIED, user.verified);
    },
    logout({ commit }) {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('tokenExpiration');
      window.localStorage.removeItem('user');
      router.push({ name: 'login' });
      commit('logout');
    },
    editUser({ commit }, { id, data }) {
      return new Promise((resolve, reject) => {
        commit('loadingModule/showLoading', true, { root: true });
        apiUsers
          .update(id, data)
          .then(() => {
            buildSuccess('Registro guardado con éxito', commit, resolve);
            commit('loadingModule/showLoading', false, { root: true });
            resolve();
          })
          .catch(error => {
            handleError(error, commit, reject);
          });
      });
    },
  },
  getters: {
    user: state =>
      state.user ? state.user.first_name + ' ' + state.user.last_name : ' ',
    token: state => (state.user ? state.user.token : ' '),
    isTokenSet: state => state.isTokenSet,
  },
  mutations: {
    saveToken(state, token) {
      state.token = token;
      state.isTokenSet = true;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isTokenSet = false;
    },
    saveUser(state, user) {
      state.user = user;
    },
  },
};

export default module;
