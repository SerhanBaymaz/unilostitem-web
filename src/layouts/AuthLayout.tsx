import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-surface-warm">
      <Outlet />
    </div>
  );
}
