'use client'

export default function MainLayout({ children }) {
  // Minimal compatibility wrapper used by app route pages converted from the Vite SPA.
  // This intentionally avoids bringing in the full template layout to keep the
  // integration safe and fast. If you want the full layout (navbar/sidebar/footer),
  // we can replace this with the project's Vertical/Horizontal layouts.
  return <div>{children}</div>;
}
