import API from '#/api';
import { NotificationType } from '#/api/notifications';
import NextLink from '#/components/NextLink';
import { PostItem } from '#/components/timelines/PostItem';
import { useTimelinePagination } from '#/components/timelines/usePostPagination';
import getInitialPropsWrapper from '#/functions/getInitialPropsWrapper';
import { LoginRequired } from '#/functions/getInitialPropsWrapper/middleware';
import { usePostData } from '#/hooks/posts/usePostData';
import useMediaSize from '#/hooks/useMediaSize';
import { useObserver } from '#/hooks/useObserver';
import paths from '#/paths';
import { MentionComponent } from '#/PostWriter/DraftEditor/mention';
import { glassmorphism } from '#/styles';
import { Cloud, Favorite, Person, SvgIconComponent } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  Stack,
  SvgIconProps,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useRef } from 'react';

const replaceNotificationText = (noti: NotificationType) =>
  noti.text.replace('{{nickname}}', noti.from_user.nickname);

const NotificationDisplayItem: React.FC<{
  notification: NotificationType;
  icon: SvgIconComponent;
  color?: SvgIconProps['color'];
  href?: string;
  text?: string;
}> = ({ notification, icon: Icon, color = 'primary', href, text }) => {
  const { isSmall } = useMediaSize();
  const smallSizePadding = isSmall ? 1 : 2;
  const render = (
    <Stack spacing={2}>
      <Stack spacing={2} pl={smallSizePadding + 1}>
        <Stack direction='row' spacing={2} pt={1}>
          <Icon color={color} />
          <Stack direction='row' spacing={1}>
            <MentionComponent mention={notification.from_user} />
            <Typography color='textPrimary'>
              {notification.text.replace('{{nickname}}', '')}
            </Typography>
          </Stack>
        </Stack>
        {text && (
          <Typography color='textDisabled' pl={5}>
            {' '}
            {text}
          </Typography>
        )}
      </Stack>

      <Divider />
    </Stack>
  );
  if (href) return <NextLink href={href}>{render}</NextLink>;
  return render;
};

const NotificationItem: React.FC<{ notification: NotificationType }> = ({
  notification,
}) => {
  const showPost =
    notification.mentioned_post?.post ||
    notification.quoted_post ||
    notification.replied_post;
  const [post] = usePostData(showPost);
  const [postForText] = usePostData(
    (notification.favorited_post || notification.reposted_post)?.post
  );
  const text = useMemo(
    () => replaceNotificationText(notification),
    [notification]
  );
  if (post)
    return <PostItem post={post} showParent={false} disableLatestRepost />;
  else if (notification.favorited_post)
    return (
      <NotificationDisplayItem
        notification={notification}
        icon={Favorite}
        color='error'
        href={paths.postDetail(notification.favorited_post.post)}
        text={postForText?.text}
      />
    );
  else if (notification.reposted_post)
    return (
      <NotificationDisplayItem
        notification={notification}
        icon={Cloud}
        color='info'
        href={paths.postDetail(notification.reposted_post.post)}
        text={postForText?.text}
      />
    );
  return (
    <NotificationDisplayItem
      notification={notification}
      icon={Person}
      href={paths.mypage(notification.from_user.username)}
    />
  );
};

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
    <Box>
      <Box
        position='sticky'
        top={0}
        p={1}
        sx={(theme) => ({ ...glassmorphism(theme), zIndex: 10 })}
      >
        <Typography variant='h5'>Notification</Typography>
      </Box>
      <Stack spacing={1} pt={1}>
        {1 <= newData.length && (
          <>
            <Button sx={{ pt: 1.5 }} onClick={mergeDatas}>
              {newData.length} 게시글 보기
            </Button>
            <Divider />
          </>
        )}
        {data.map((noti) => (
          <NotificationItem notification={noti} key={noti.id} />
        ))}
        <Box ref={patchNextBlock} />
      </Stack>
    </Box>
  );
};

NotificationsPage.getInitialProps = getInitialPropsWrapper(async () => {}, {
  pre: [LoginRequired],
});

export default NotificationsPage;
