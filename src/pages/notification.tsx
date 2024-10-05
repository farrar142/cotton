import API from '#/api';
import { useNotificationList } from '#/components/layouts/pages/Notifications/NotificationAtom';
import { NotificationItem } from '#/components/layouts/pages/Notifications/NotificationItem';
import { useTimelinePagination } from '#/components/timelines/usePostPagination';
import { getLoginRequiredInitialPropsWrapper } from '#/functions/getInitialPropsWrapper';
import {
  useKeepScrollPosition,
  useKeyScrollPosition,
} from '#/hooks/useKeepScrollPosition';
import { useObserver } from '#/hooks/useObserver';
import { glassmorphism } from '#/styles';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import { useEffect, useRef } from 'react';

const NotificationsPage: ExtendedNextPage = ({ user }) => {
  if (!user) throw Error;
  useKeepScrollPosition('page:notification', true);
  const [_, setScroll] = useKeyScrollPosition();
  const { data, getNextPage, newData, mergeDatas } = useTimelinePagination({
    func: API.Notifications.notification.getItems,
    params: {},
    apiKey: `${user.username}`,
    disablePrevfetch: true,
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

  const [notificationList, ___, handleNotifications] =
    useNotificationList(user);

  useEffect(() => {
    handleNotifications(data);
  }, [data]);

  return (
    <Box>
      <Box
        position='sticky'
        top={0}
        p={1}
        sx={(theme) => ({
          ...glassmorphism(theme),
          zIndex: 10,
          cursor: 'pointer',
          ':hover': { bgcolor: theme.palette.action.hover },
        })}
        onClick={() => setScroll({ key: 'page:notification', value: 0 })}
      >
        <Typography variant='h5'>Notification</Typography>
      </Box>
      <Stack spacing={1} pt={1}>
        {1 <= newData.length && (
          <>
            <Button sx={{ pt: 1.5 }} onClick={mergeDatas}>
              {newData.length} 개의 알람 더 보기
            </Button>
            <Divider />
          </>
        )}
        {notificationList.map((noti) => (
          <NotificationItem notification={noti} key={noti.id} user={user} />
        ))}
        <Box ref={patchNextBlock} />
      </Stack>
    </Box>
  );
};

NotificationsPage.getInitialProps = getLoginRequiredInitialPropsWrapper(
  async () => {}
);

export default NotificationsPage;
