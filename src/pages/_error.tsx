import * as Sentry from '@sentry/nextjs';
import type { NextPage, NextPageContext } from 'next';
import Error from 'next/error';
const ErrorPage: NextPage = () => {
  return <div>error</div>;
};

// Replace "YourCustomErrorComponent" with your custom error component!
ErrorPage.getInitialProps = async (contextData: NextPageContext) => {
  await Sentry.captureUnderscoreErrorException(contextData);

  return Error.getInitialProps(contextData);
};
export default ErrorPage;
