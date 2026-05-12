import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { Link } from 'react-router';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useRegister } from '@/features/auth/hooks';
import { PasswordInput, PhoneInput } from '@/shared/components';

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'auth.required'),
    lastName: z.string().min(1, 'auth.required'),
    email: z.string().min(1, 'auth.required').email('auth.invalidEmail'),
    password: z
      .string()
      .min(1, 'auth.required')
      .min(6, 'auth.passwordMin')
      .regex(/[A-Z]/, 'auth.passwordUppercase')
      .regex(/[a-z]/, 'auth.passwordLowercase')
      .regex(/\d/, 'auth.passwordDigit')
      .regex(/[^a-zA-Z0-9]/, 'auth.passwordSpecial'),
    confirmPassword: z.string().min(1, 'auth.required'),
    phoneNumber: z
      .string()
      .min(1, 'auth.required')
      .refine((val) => isValidPhoneNumber(val), 'auth.invalidPhone'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.passwordMatch',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const PASSWORD_CHECKS = [
  { key: 'auth.passwordMin', test: (v: string) => v.length >= 6 },
  { key: 'auth.passwordUppercase', test: (v: string) => /[A-Z]/.test(v) },
  { key: 'auth.passwordLowercase', test: (v: string) => /[a-z]/.test(v) },
  { key: 'auth.passwordDigit', test: (v: string) => /\d/.test(v) },
  { key: 'auth.passwordSpecial', test: (v: string) => /[^a-zA-Z0-9]/.test(v) },
] as const;

export default function RegisterPage() {
  const { t } = useTranslation();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    },
  });

  const passwordValue = watch('password') ?? '';

  const onSubmit = (data: RegisterFormData) => {
    // eslint-disable-next-line sonarjs/no-unused-vars
    const { confirmPassword: _, ...payload } = data;
    registerMutation.mutate(payload);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="font-heading text-2xl text-stone-900 sm:text-[28px] dark:text-stone-50">
          {t('auth.registerTitle')}
        </h1>
        <p className="mt-1.5 text-[14px] text-stone-500 dark:text-stone-400">
          {t('auth.registerSubtitle')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-stone-700 dark:text-stone-300">
              {t('auth.firstName')}
            </Label>
            <Input
              id="firstName"
              autoComplete="given-name"
              aria-invalid={!!errors.firstName}
              className="h-10 rounded-md border-stone-200 bg-stone-50 text-[15px] placeholder:text-stone-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800/50 dark:placeholder:text-stone-500"
              {...register('firstName')}
            />
            {errors.firstName?.message && (
              <p className="text-[13px] text-red-600">{t(errors.firstName.message)}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-stone-700 dark:text-stone-300">
              {t('auth.lastName')}
            </Label>
            <Input
              id="lastName"
              autoComplete="family-name"
              aria-invalid={!!errors.lastName}
              className="h-10 rounded-md border-stone-200 bg-stone-50 text-[15px] placeholder:text-stone-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800/50 dark:placeholder:text-stone-500"
              {...register('lastName')}
            />
            {errors.lastName?.message && (
              <p className="text-[13px] text-red-600">{t(errors.lastName.message)}</p>
            )}
          </div>
        </div>

        <Separator className="!bg-stone-100 dark:!bg-stone-800" />

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="reg-email" className="text-stone-700 dark:text-stone-300">
            {t('auth.email')}
          </Label>
          <Input
            id="reg-email"
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

        {/* Password Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="reg-password" className="text-stone-700 dark:text-stone-300">
              {t('auth.password')}
            </Label>
            <PasswordInput
              id="reg-password"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              className="h-10 rounded-md border-stone-200 bg-stone-50 text-[15px] placeholder:text-stone-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800/50 dark:placeholder:text-stone-500"
              {...register('password')}
            />
            {errors.password?.message && (
              <p className="text-[13px] text-red-600">{t(errors.password.message)}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-stone-700 dark:text-stone-300">
              {t('auth.confirmPassword')}
            </Label>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              className="h-10 rounded-md border-stone-200 bg-stone-50 text-[15px] placeholder:text-stone-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800/50 dark:placeholder:text-stone-500"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword?.message && (
              <p className="text-[13px] text-red-600">{t(errors.confirmPassword.message)}</p>
            )}
          </div>
        </div>

        {/* Password Requirements */}
        {passwordValue.length > 0 && (
          <ul className="space-y-1">
            {PASSWORD_CHECKS.map((check) => {
              const met = check.test(passwordValue);
              return (
                <li
                  key={check.key}
                  className={`flex items-center gap-1.5 text-[12px] ${
                    met
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-stone-400 dark:text-stone-500'
                  }`}
                >
                  <Check className={`h-3 w-3 ${met ? 'opacity-100' : 'opacity-30'}`} />
                  {t(check.key)}
                </li>
              );
            })}
          </ul>
        )}

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="phoneNumber" className="text-stone-700 dark:text-stone-300">
            {t('auth.phoneNumber')}
          </Label>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <PhoneInput
                id="phoneNumber"
                value={field.value ?? ''}
                onChange={field.onChange}
                placeholder="5XX XXX XX XX"
              />
            )}
          />
          {errors.phoneNumber?.message && (
            <p className="text-[13px] text-red-600">{t(errors.phoneNumber.message)}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={registerMutation.isPending}
          className="h-10 w-full rounded-md text-[15px] font-medium"
        >
          {registerMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {t('auth.register')}
        </Button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-[14px] text-stone-500 dark:text-stone-400">
        {t('auth.hasAccount')}{' '}
        <Link
          to="/login"
          className="font-medium text-amber-600 transition-colors hover:text-amber-700"
        >
          {t('auth.login')}
        </Link>
      </p>
    </>
  );
}
