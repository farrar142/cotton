import API from '#/api';
import { NotificationType } from '#/api/notifications';
import { useTimelinePagination } from '#/components/timelines/usePostPagination';
import getInitialPropsWrapper from '#/functions/getInitialPropsWrapper';
import { LoginRequired } from '#/functions/getInitialPropsWrapper/middleware';
import { useObserver } from '#/hooks/useObserver';
import { Box, Stack } from '@mui/material';
import React, { useEffect, useRef } from 'react';

const replaceNotificationText = (noti: NotificationType) =>
  noti.text.replace('{{nickname}}', noti.from_user.nickname);

const NotificationsPage: ExtendedNextPage = ({ user }) => {
  if (!user) throw Error;
  const { data, getNextPage, newData, mergeDatas } = useTimelinePagination({
    func: API.Notifications.notification.getItems,
    params: {},
    apiKey: `${user.username}`,
  });
  const patchNextBlock = useRef<HTMLDivElement>();
  const observer = useObserver();
  useEffect(() => {
    const block = patchNextBlock.current;
    if (!block) return;
    observer.observe(block);
    observer.onIntersection(getNextPage);
    return () => observer.unobserve(block);
  }, [data]);
  return (
    <Stack>
      {data.map((noti) => (
        <Box key={noti.id}>{replaceNotificationText(noti)}</Box>
      ))}
      <Box ref={patchNextBlock} />
    </Stack>
  );
};

NotificationsPage.getInitialProps = getInitialPropsWrapper(async () => {}, {
  pre: [LoginRequired],
});

export default NotificationsPage;
