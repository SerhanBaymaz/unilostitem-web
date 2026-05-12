import { afterEach, describe, expect, it } from 'vitest';
import { useLocaleStore } from './localeStore';

describe('useLocaleStore', () => {
  afterEach(() => {
    useLocaleStore.setState({ locale: 'tr' });
  });

  it('has default locale tr', () => {
    expect(useLocaleStore.getState().locale).toBe('tr');
  });

  it('setLocale updates locale', () => {
    useLocaleStore.getState().setLocale('en');
    expect(useLocaleStore.getState().locale).toBe('en');
  });

  it('setLocale toggles back to tr', () => {
    useLocaleStore.getState().setLocale('en');
    useLocaleStore.getState().setLocale('tr');
    expect(useLocaleStore.getState().locale).toBe('tr');
  });
});
