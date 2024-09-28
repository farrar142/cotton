import API from '#/api';
import { RegisteredUser, User } from '#/api/users/types';
import { PostTimeline } from '#/components/timelines';
import { MediaTimeline } from '#/components/timelines/MediaTimeline';
import { useKeyScrollPosition } from '#/hooks/useKeepScrollPosition';
import useValue from '#/hooks/useValue';
import { glassmorphism } from '#/styles';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Divider, Tab, useTheme } from '@mui/material';

const ProfileTab: React.FC<{ profile: RegisteredUser }> = ({ profile }) => {
  const articleKey = `timeline/${profile.username}`;
  const replyKey = `timeline/${profile.username}/reply`;
  const mediaKey = `timeline/${profile.username}/media`;
  const favoriteKey = `timeline/${profile.username}/favorite`;
  const theme = useTheme();
  const tabValue = useValue(articleKey);
  const [_, setScroll] = useKeyScrollPosition();
  return (
    <Box
      sx={{
        '.MuiTabPanel-root': {
          p: 0,
        },
      }}
    >
      <TabContext value={tabValue.get}>
        <TabList
          sx={{
            display: 'flex',
            position: 'sticky',
            top: 65,
            zIndex: 10,
            ...glassmorphism(theme),
          }}
          onChange={(e, v) => tabValue.set(v)}
        >
          <Tab
            label='게시물'
            value={articleKey}
            sx={{ flex: 1 }}
            onClick={(e) =>
              e.currentTarget.tabIndex === 0 &&
              setScroll({ key: articleKey, value: 0 })
            }
          />
          <Tab
            label='답글'
            value={replyKey}
            sx={{ flex: 1 }}
            onClick={(e) =>
              e.currentTarget.tabIndex === 0 &&
              setScroll({ key: replyKey, value: 0 })
            }
          />
          <Tab
            label='미디어'
            value={mediaKey}
            sx={{ flex: 1 }}
            onClick={(e) =>
              e.currentTarget.tabIndex === 0 &&
              setScroll({ key: mediaKey, value: 0 })
            }
          />
          <Tab
            label='마음에들어요'
            value={favoriteKey}
            sx={{ flex: 1 }}
            onClick={(e) =>
              e.currentTarget.tabIndex === 0 &&
              setScroll({ key: favoriteKey, value: 0 })
            }
          />
        </TabList>
        <Divider sx={{ mb: 0.5 }} />
        <TabPanel value={articleKey}>
          <PostTimeline
            getter={API.Posts.post.getUserTimeline(profile.username)}
            type={articleKey}
          />
        </TabPanel>
        <TabPanel value={replyKey}>
          <PostTimeline
            getter={API.Posts.post.getUserRepliesItems(profile.username)}
            type={replyKey}
          />
        </TabPanel>
        <TabPanel value={mediaKey}>
          <MediaTimeline
            getter={API.Posts.post.getUserMediaItems(profile.username)}
            type={mediaKey}
          />
        </TabPanel>
        <TabPanel value={favoriteKey}>
          <PostTimeline
            getter={API.Posts.post.getFavoriteItems(profile.username)}
            type={favoriteKey}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default ProfileTab;
