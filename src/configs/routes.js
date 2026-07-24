export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  dashboard: '/dashboard',
  notFound: '/not-found',
}

export const protectedRoutes = [routes.dashboard]

export const isProtectedRoute = pathname => protectedRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))
