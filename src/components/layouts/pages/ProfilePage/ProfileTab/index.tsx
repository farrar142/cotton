import API from '#/api';
import { RegisteredUser } from '#/api/users/types';
import { CommonTab } from '#/components/layouts/CommonTab';
import { PostTimeline } from '#/components/timelines';
import { MediaTimeline } from '#/components/timelines/MediaTimeline';
import { useKeyScrollPosition } from '#/hooks/useKeepScrollPosition';
import { Box } from '@mui/material';

const ProfileTab: React.FC<{ profile: RegisteredUser }> = ({ profile }) => {
  const articleKey = `timeline/${profile.username}`;
  const replyKey = `timeline/${profile.username}/reply`;
  const mediaKey = `timeline/${profile.username}/media`;
  const favoriteKey = `timeline/${profile.username}/favorite`;
  const [_, setScroll] = useKeyScrollPosition();
  return (
    <Box
      sx={{
        '.MuiTabPanel-root': {
          p: 0,
        },
      }}
    >
      <CommonTab
        top={65}
        labels={[
          {
            label: '게시물',
            value: '게시물',
            onClick: (e) =>
              e.currentTarget.tabIndex === 0 &&
              setScroll({ key: articleKey, value: 0 }),
          },
          {
            label: '답글',
            value: '답글',
            onClick: (e) =>
              e.currentTarget.tabIndex === 0 &&
              setScroll({ key: replyKey, value: 0 }),
          },
          {
            label: '미디어',
            value: '미디어',
            onClick: (e) =>
              e.currentTarget.tabIndex === 0 &&
              setScroll({ key: mediaKey, value: 0 }),
          },
          {
            label: '마음에들어요',
            value: '마음에들어요',
            onClick: (e) =>
              e.currentTarget.tabIndex === 0 &&
              setScroll({ key: favoriteKey, value: 0 }),
          },
        ]}
        panels={[
          <PostTimeline
            getter={API.Posts.post.getUserTimeline(profile.username)}
            type={articleKey}
            key={articleKey}
          />,
          <PostTimeline
            getter={API.Posts.post.getUserRepliesItems(profile.username)}
            type={replyKey}
            key={replyKey}
            showParent
          />,
          <MediaTimeline
            getter={API.Posts.post.getUserMediaItems(profile.username)}
            type={mediaKey}
            key={mediaKey}
          />,
          <PostTimeline
            getter={API.Posts.post.getFavoriteItems(profile.username)}
            type={favoriteKey}
            key={favoriteKey}
          />,
        ]}
      />
    </Box>
  );
};

export default ProfileTab;
