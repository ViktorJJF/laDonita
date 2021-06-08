import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    redirect: { name: 'BrandsList' },
    name: 'dashboard',
    children: [
      {
        path: '/marcas',
        name: 'BrandsList',
        component: () => import('@/views/BrandsList.vue'),
      },
      {
        path: '/marcas/:id',
        name: 'BrandsAdd',
        component: () => import('@/views/BrandsAdd.vue'),
      },
      {
        path: '/productos',
        name: 'ProductsList',
        component: () => import('@/views/ProductsList.vue'),
      },
      {
        path: '/productos/:id',
        name: 'ProductsAdd',
        component: () => import('@/views/ProductsAdd.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
