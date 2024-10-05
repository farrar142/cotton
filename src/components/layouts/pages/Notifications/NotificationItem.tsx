import { NotificationType } from '#/api/notifications';
import NextLink from '#/components/NextLink';
import { PostItem } from '#/components/timelines/PostItem';
import { usePostData } from '#/hooks/posts/usePostData';
import useMediaSize from '#/hooks/useMediaSize';
import paths from '#/paths';
import { MentionComponent } from '#/PostWriter/DraftEditor/mention';
import { SvgIconComponent, Favorite, Cloud, Person } from '@mui/icons-material';
import { SvgIconProps, Stack, Typography, Divider } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { replaceNotificationText } from './utils';
import { User } from '#/api/users/types';
import { useUnCheckedNotification } from './NotificationAtom';
import API from '#/api';

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

export const NotificationItem: React.FC<{
  notification: NotificationType;
  user: User;
}> = ({ notification, user }) => {
  const { check } = useUnCheckedNotification(user);
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
  useEffect(() => {
    if (notification.is_checked) return;
    check(notification);
  }, [notification.is_checked]);
  if (post)
    return <PostItem post={post} showParent={true} disableLatestRepost />;
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
