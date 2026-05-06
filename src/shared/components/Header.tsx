import { Link, useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Menu, Search, Globe, LogIn, LogOut, User, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useLocaleStore } from '@/shared/store/localeStore';

const navLinks = [
  { path: '/', labelKey: 'nav.home' },
  { path: '/items', labelKey: 'nav.items' },
] as const;

export function Header() {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { setLocale } = useLocaleStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLocaleChange = (newLocale: 'tr' | 'en') => {
    setLocale(newLocale);
    i18n.changeLanguage(newLocale);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[60px] max-w-screen-xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="font-heading text-xl text-stone-900">
          UniLostItem
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`rounded-md px-3 py-1.5 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors ${
                isActive(link.path)
                  ? 'text-stone-900'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        {/* Desktop Search + Controls */}
        <div className="hidden items-center gap-2 md:flex">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              placeholder={t('common.search')}
              className="h-8 w-[240px] bg-stone-100 pl-9 text-[15px] placeholder:text-stone-400 focus:bg-white"
            />
          </div>

          {/* Locale Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
              <Globe className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleLocaleChange('tr')}>
                Türkçe
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLocaleChange('en')}>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth Menu */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-stone-100 text-xs font-semibold text-stone-600">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  {user.firstName} {user.lastName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4" />
                  {t('nav.profile')}
                </DropdownMenuItem>
                {user.role === 'Admin' && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <LayoutDashboard className="h-4 w-4" />
                    {t('nav.admin')}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" render={<Link to="/login" />}>
                {t('nav.login')}
              </Button>
              <Button size="sm" render={<Link to="/register" />}>
                {t('nav.register')}
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-1 md:hidden">
          <Button variant="ghost" size="icon-sm">
            <Search className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
              <Globe className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleLocaleChange('tr')}>
                Türkçe
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLocaleChange('en')}>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-stone-100 text-xs font-semibold text-stone-600">
                    {user?.firstName[0]}
                    {user?.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  {user?.firstName} {user?.lastName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4" />
                  {t('nav.profile')}
                </DropdownMenuItem>
                {user?.role === 'Admin' && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <LayoutDashboard className="h-4 w-4" />
                    {t('nav.admin')}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" render={<Link to="/login" />}>
              <LogIn className="h-4 w-4" />
            </Button>
          )}

          {/* Mobile Hamburger Menu */}
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon-sm" />}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-background">
              <SheetHeader>
                <SheetTitle className="font-heading text-xl text-stone-900">
                  UniLostItem
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`rounded-md px-3 py-2.5 text-sm font-medium uppercase tracking-[0.08em] transition-colors ${
                      isActive(link.path)
                        ? 'bg-stone-100 text-stone-900'
                        : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    {t(link.labelKey)}
                  </Link>
                ))}
                {isAuthenticated && (
                  <>
                    <div className="my-2 h-px bg-stone-200" />
                    <Link
                      to="/items/new"
                      className="rounded-md px-3 py-2.5 text-sm font-medium uppercase tracking-[0.08em] text-stone-500 transition-colors hover:bg-stone-50 hover:text-stone-900"
                    >
                      {t('items.addItem')}
                    </Link>
                    <Link
                      to="/profile"
                      className="rounded-md px-3 py-2.5 text-sm font-medium uppercase tracking-[0.08em] text-stone-500 transition-colors hover:bg-stone-50 hover:text-stone-900"
                    >
                      {t('nav.profile')}
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
