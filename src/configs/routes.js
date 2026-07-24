export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  dashboard: '/dashboard',
};

export const isPublicRoute = (pathname = '/') => {
  const publicRoutes = [routes.home, routes.login, routes.register, routes.forgotPassword];

  return publicRoutes.includes(pathname);
};
