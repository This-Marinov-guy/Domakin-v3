import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

// Custom fallback component
const ErrorFallback = ({ resetErrorBoundary }: any) => {
  const router = useRouter();

  const {t} = useTranslation('translations');

  return (
    <div className="container">
      <h3>{t('react_error.something_went_wrong')}</h3>
      <button onClick={resetErrorBoundary}>{t('react_error.try_again')}</button>
      <button onClick={() => router.push('/')}>{t('react_error.go_home')}</button>
    </div>
  );
};

const MyErrorBoundary = ({ children }: any) => {
  const router = useRouter();

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      key={router.asPath} // Force remount on route change
    >
      {children}
    </ErrorBoundary>
  );
};

export default MyErrorBoundary;
    