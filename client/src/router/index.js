import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    redirect: { name: 'Dashboard' },
    children: [
      {
        path: '/inicio',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
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
        path: '/ventas',
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
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
