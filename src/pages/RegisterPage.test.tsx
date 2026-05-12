import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import RegisterPage from './RegisterPage';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'tr' },
  }),
}));

vi.mock('react-router', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => vi.fn(),
}));

vi.mock('react-phone-number-input/style.css', () => ({}));

const mockMutate = vi.fn();
vi.mock('@/features/auth/hooks', () => ({
  useRegister: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

describe('RegisterPage', () => {
  it('renders form fields and submit button', () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText('auth.firstName')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.lastName')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.email')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.password')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.confirmPassword')).toBeInTheDocument();
    expect(screen.getByText('auth.register')).toBeInTheDocument();
  });

  it('shows login link in footer', () => {
    render(<RegisterPage />);
    expect(screen.getByText('auth.login')).toHaveAttribute('href', '/login');
  });

  it('shows password requirements when password is typed', async () => {
    render(<RegisterPage />);
    const passwordInput = screen.getByLabelText('auth.password');

    await userEvent.type(passwordInput, 'A');

    expect(screen.getByText('auth.passwordMin')).toBeInTheDocument();
    expect(screen.getByText('auth.passwordUppercase')).toBeInTheDocument();
    expect(screen.getByText('auth.passwordLowercase')).toBeInTheDocument();
    expect(screen.getByText('auth.passwordDigit')).toBeInTheDocument();
    expect(screen.getByText('auth.passwordSpecial')).toBeInTheDocument();
  });

  it('does not show password requirements when password is empty', () => {
    render(<RegisterPage />);
    expect(screen.queryByText('auth.passwordMin')).not.toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    render(<RegisterPage />);
    await userEvent.click(screen.getByText('auth.register'));

    await waitFor(() => {
      const errors = screen.getAllByText('auth.required');
      expect(errors.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('shows password mismatch error', async () => {
    render(<RegisterPage />);

    await userEvent.type(screen.getByLabelText('auth.password'), 'Pass1!');
    await userEvent.type(screen.getByLabelText('auth.confirmPassword'), 'Different1!');
    await userEvent.click(screen.getByText('auth.register'));

    await waitFor(() => {
      expect(screen.getByText('auth.passwordMatch')).toBeInTheDocument();
    });
  });

  it('calls mutate with form data on valid submit', async () => {
    render(<RegisterPage />);

    await userEvent.type(screen.getByLabelText('auth.firstName'), 'Ahmet');
    await userEvent.type(screen.getByLabelText('auth.lastName'), 'Yilmaz');
    await userEvent.type(screen.getByLabelText('auth.email'), 'ahmet@universite.edu.tr');
    await userEvent.type(screen.getByLabelText('auth.password'), 'Pass1!');
    await userEvent.type(screen.getByLabelText('auth.confirmPassword'), 'Pass1!');

    const phoneInput = screen.getByPlaceholderText('5XX XXX XX XX');
    await userEvent.type(phoneInput, '5551234567');

    await userEvent.click(screen.getByText('auth.register'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });
  });
});
