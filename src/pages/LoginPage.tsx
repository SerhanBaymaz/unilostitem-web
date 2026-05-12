import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/features/auth/hooks';

const loginSchema = z.object({
  email: z.string().min(1, 'auth.required').email('auth.invalidEmail'),
  password: z.string().min(1, 'auth.required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { t } = useTranslation();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="font-heading text-2xl text-stone-900 sm:text-[28px] dark:text-stone-50">
          {t('auth.loginTitle')}
        </h1>
        <p className="mt-1.5 text-[14px] text-stone-500 dark:text-stone-400">
          {t('auth.loginSubtitle')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-stone-700 dark:text-stone-300">
            {t('auth.email')}
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="ornek@universite.edu.tr"
            aria-invalid={!!errors.email}
            className="h-10 rounded-md border-stone-200 bg-stone-50 text-[15px] placeholder:text-stone-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800/50 dark:placeholder:text-stone-500"
            {...register('email')}
          />
          {errors.email?.message && (
            <p className="text-[13px] text-red-600">{t(errors.email.message)}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-stone-700 dark:text-stone-300">
            {t('auth.password')}
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            className="h-10 rounded-md border-stone-200 bg-stone-50 text-[15px] placeholder:text-stone-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800/50 dark:placeholder:text-stone-500"
            {...register('password')}
          />
          {errors.password?.message && (
            <p className="text-[13px] text-red-600">{t(errors.password.message)}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="h-10 w-full rounded-md text-[15px] font-medium"
        >
          {loginMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {t('auth.login')}
        </Button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-[14px] text-stone-500 dark:text-stone-400">
        {t('auth.noAccount')}{' '}
        <Link
          to="/register"
          className="font-medium text-amber-600 transition-colors hover:text-amber-700"
        >
          {t('auth.register')}
        </Link>
      </p>
    </>
  );
}
