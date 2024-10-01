import React from 'react';
import { useEffect, useState } from 'react';

export const ClientOnlyHOC = <T extends {}>(WrappedComponent: React.FC<T>) => {
  const InnerComponent = (props: T) => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
      if (loaded) return;
      setLoaded(true);
    }, []);
    if (!loaded) return <></>;
    //@ts-ignore
    return <WrappedComponent {...props} />;
  };
  Object.entries(WrappedComponent).forEach(([key, value]) => {
    //@ts-ignore
    InnerComponent[key] = value;
  });
  return InnerComponent;
};
