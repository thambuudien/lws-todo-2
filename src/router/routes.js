const routes = [
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    // meta: { requiresAuth: true }, // Sẽ dùng sau để bảo vệ route
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'customers', component: () => import('pages/CustomersPage.vue') },
      { path: 'policies', component: () => import('pages/PoliciesPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
