import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useTranslation();

  const cycleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="relative h-8 w-10"
      onClick={cycleTheme}
      aria-label={t('common.toggleTheme')}
    >
      <Sun
        className={`h-4 w-4 transition-all ${
          resolvedTheme === 'light' ? 'rotate-0 scale-100' : 'rotate-90 scale-0 absolute'
        }`}
      />
      <Moon
        className={`h-4 w-4 transition-all ${
          resolvedTheme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0 absolute'
        }`}
      />
    </Button>
  );
}
