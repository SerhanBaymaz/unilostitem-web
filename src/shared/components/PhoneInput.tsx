import 'react-phone-number-input/style.css';

import PhoneInputLib from 'react-phone-number-input';
import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const StyledInput = forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  function StyledInput(props, ref) {
    return (
      <Input
        ref={ref}
        {...props}
        className="h-10 rounded-l-none border-stone-200 bg-stone-50 text-[15px] placeholder:text-stone-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800/50 dark:placeholder:text-stone-500"
      />
    );
  }
);

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  id?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function PhoneInput({
  value,
  onChange,
  className,
  id,
  disabled,
  placeholder,
}: PhoneInputProps) {
  return (
    <div className={cn('phone-input-wrapper', className)}>
      <PhoneInputLib
        id={id}
        disabled={disabled}
        placeholder={placeholder ?? '5XX XXX XX XX'}
        value={value || undefined}
        onChange={(val) => onChange(val ?? '')}
        defaultCountry="TR"
        international
        withCountryCallingCode
        countryCallingCodeEditable={false}
        inputComponent={StyledInput}
      />
    </div>
  );
}
