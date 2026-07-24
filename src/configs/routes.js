export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  dashboard: '/dashboard',
  dashboardHome: '/dashboard',
};

const PUBLIC_ROUTE_PREFIXES = ['/', '/login', '/register', '/forgot-password'];
const PROTECTED_ROUTE_PREFIXES = ['/dashboard'];

export const isPublicRoute = (pathname = '/') => {
  if (!pathname) return true

  return PUBLIC_ROUTE_PREFIXES.some(route => pathname === route || pathname.startsWith(`${route}/`))
}

export const isProtectedRoute = (pathname = '/') => {
  if (!pathname) return false

  return PROTECTED_ROUTE_PREFIXES.some(route => pathname === route || pathname.startsWith(`${route}/`))
}
