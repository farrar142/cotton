import React from 'react';
import { useEffect, useState } from 'react';

export const ClientOnlyHOC =
  <T extends {}>(WrappedComponent: React.FC<T>) =>
  (props: T) => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
      if (loaded) return;
      setLoaded(true);
    }, []);
    if (!loaded) return <></>;
    return <WrappedComponent {...props} />;
  };
