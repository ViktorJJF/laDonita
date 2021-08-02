import { createApp } from 'vue';

// components
import Paginate from 'v-pagination-3';
import VCalendar from 'v-calendar';

// import JQuery from 'jquery';
import App from '@/App.vue';
// Element plus
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

import router from '@/router';
import store from '@/store';
import initialize from '@/filters/filters';

// mdi icons
// import '@mdi/font/css/materialdesignicons.css';

const app = createApp(App);
initialize(app);
app.component('pagination', Paginate);
app.use(VCalendar);
app.use(ElementPlus);

// window.$ = window.jQuery = JQuery;

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'jquery';
// import 'jquery/dist/jquery.min';
// import 'bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'perfect-scrollbar/dist/perfect-scrollbar.min';
// import 'perfect-scrollbar/css/perfect-scrollbar.css';
// import 'masonry-layout/dist/masonry.pkgd.min';
// import 'flag-icon-css/css/flag-icon.min.css';

// import '../public/assets/js/functions';

// import '../public/assets/js/customizer';
// import '../public/assets/js/script';

// plugins
import mosha from '@/plugins/moshaToastify';
import deepCopy from '@/plugins/deepCopy';
import uuid from '@/plugins/uuid';
import sweetAlert from '@/plugins/sweetAlert';
import '@/plugins/axios';

mosha(app);
app.use(deepCopy);
app.use(uuid);
app.use(sweetAlert);

// styles
import '@/assets/scss/styles.scss';

app
  .use(store)
  .use(router)
  .mount('#app');
