import { CircularProgress } from '@mui/material';
import { Suspense } from 'react';

export const SuspendHOC =
  <P extends {}>(WrappedComponent: React.FC<P>) =>
  (props: P) => {
    return (
      <Suspense fallback={<CircularProgress />}>
        <WrappedComponent {...props} />
      </Suspense>
    );
  };
