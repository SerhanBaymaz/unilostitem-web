import { LayoutDashboard, Package, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from 'react-router';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { path: '/admin', key: 'dashboard', icon: LayoutDashboard },
  { path: '/admin/claims', key: 'claims', icon: ShieldCheck },
  { path: '/admin/items', key: 'items', icon: Package },
] as const;

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <nav className="flex flex-col gap-1 p-2">
      {navItems.map(({ path, key, icon: Icon }) => {
        const isActive =
          key === 'dashboard' ? location.pathname === '/admin' : location.pathname.startsWith(path);

        return (
          <Link
            key={path}
            to={path}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Icon className="h-4 w-4" />
            {t(`admin.${key}`)}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-svh bg-background">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-svh w-56 shrink-0 flex-col border-r border-stone-200 bg-stone-50/50 lg:flex dark:border-stone-700 dark:bg-stone-900/50">
        <div className="flex h-14 items-center gap-2 px-4">
          <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <span className="font-heading text-sm font-semibold text-stone-900 dark:text-stone-50">
            {t('admin.title')}
          </span>
        </div>
        <Separator />
        <SidebarNav />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-stone-200 bg-background px-4 lg:hidden dark:border-stone-700">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon-sm" />} />
            <SheetContent side="left" className="w-56">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  {t('admin.title')}
                </SheetTitle>
              </SheetHeader>
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="font-heading text-sm font-semibold text-stone-900 dark:text-stone-50">
            {t('admin.title')}
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
