import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    redirect: { name: 'SeguimientoEgresados' },
    name: 'dashboard',
    children: [
      {
        path: '/seguimiento-egresados',
        name: 'SeguimientoEgresados',
        component: () => import('@/views/SeguimientoEgresados.vue'),
      },
      // {
      //   path: '/marcas',
      //   name: 'Brands',
      //   component: () => import('@/views/Brands.vue'),
      // },
      // {
      //   path: '/perfil',
      //   name: 'UserProfile',
      //   component: () => import('@/views/UserProfile.vue'),
      // },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
