import getInitialPropsWrapper from '#/functions/getInitialPropsWrapper';
import { LoginRequired } from '#/functions/getInitialPropsWrapper/middleware';
import React from 'react';

const MessagesPage: ExtendedNextPage = () => {
  return <></>;
};

MessagesPage.getInitialProps = getInitialPropsWrapper(async () => {}, {
  pre: [LoginRequired],
});
export default MessagesPage;
