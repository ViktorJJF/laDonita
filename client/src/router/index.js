import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const routes = [
  {
    path: '/login',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    name: 'dashboard',
    redirect: { name: 'Home' },
    children: [
      {
        path: '/inicio',
        name: 'Home',
        component: () => import('@/views/Dashboard.vue'),
      },
      {
        path: '/perfil',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'),
      },
      {
        path: '/marcas',
        name: 'BrandsList',
        component: () => import('@/views/BrandsList.vue'),
      },
      {
        path: '/marcas/crear',
        name: 'BrandsCreate',
        component: () => import('@/views/BrandsAdd.vue'),
      },
      {
        path: '/marcas/:id',
        name: 'BrandsAdd',
        component: () => import('@/views/BrandsAdd.vue'),
      },
      {
        path: '/insumos',
        name: 'SuppliersList',
        component: () => import('@/views/SuppliersList.vue'),
      },
      {
        path: '/insumos/crear',
        name: 'SuppliersCreate',
        component: () => import('@/views/SuppliersAdd.vue'),
      },
      {
        path: '/insumos/:id',
        name: 'SuppliersAdd',
        component: () => import('@/views/SuppliersAdd.vue'),
      },
      {
        path: '/proveedores',
        name: 'ProvidersList',
        component: () => import('@/views/ProvidersList.vue'),
      },
      {
        path: '/proveedores/crear',
        name: 'ProvidersCreate',
        component: () => import('@/views/ProvidersAdd.vue'),
      },
      {
        path: '/proveedores/:id',
        name: 'ProvidersAdd',
        component: () => import('@/views/ProvidersAdd.vue'),
      },
      {
        path: '/productos',
        name: 'ProductsList',
        component: () => import('@/views/ProductsList.vue'),
      },
      {
        path: '/productos/crear',
        name: 'ProductsCreate',
        component: () => import('@/views/ProductsAdd.vue'),
      },
      {
        path: '/productos/:id',
        name: 'ProductsAdd',
        component: () => import('@/views/ProductsAdd.vue'),
      },
      {
        path: '/historial-ventas',
        name: 'SalesList',
        component: () => import('@/views/SalesList.vue'),
      },
      {
        path: '/ventas/crear',
        name: 'SalesAdd',
        component: () => import('@/views/SalesAdd.vue'),
      },
      {
        path: '/compras',
        name: 'PurchasesList',
        component: () => import('@/views/PurchasesList.vue'),
      },
      {
        path: '/compras/crear',
        name: 'PurchasesAdd',
        component: () => import('@/views/PurchasesAdd.vue'),
      },
      {
        path: '/reportes/ventas',
        name: 'ReportSales',
        component: () => import('@/views/ReportSales.vue'),
      },
      {
        path: '/reportes/compras',
        name: 'ReportPurchases',
        component: () => import('@/views/ReportPurchases.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  // checkForUpdates();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isTokenSet = store.getters['authModule/isTokenSet'];
  console.log('🚀 Aqui *** -> isTokenSet', requiresAuth, isTokenSet);
  if (requiresAuth && !isTokenSet) {
    return next({ name: 'login' });
  } // checkIfTokenNeedsRefresh(); //
  console.log('jaja');
  store.commit('successModule/success', null); //
  // store.commit('errorModule/error', null);
  return next();
});

export default router;
