import { Outlet } from 'react-router';

export default function MainLayout() {
  return (
    <div className="min-h-svh bg-background">
      <Outlet />
    </div>
  );
}
