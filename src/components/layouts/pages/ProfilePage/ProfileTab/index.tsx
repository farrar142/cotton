import API from '#/api';
import { User } from '#/api/users/types';
import { PostTimeline } from '#/components/timelines';
import { MediaTimeline } from '#/components/timelines/MediaTimeline';
import useValue from '#/hooks/useValue';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Divider, Tab } from '@mui/material';

const ProfileTab: React.FC<{ profile: User }> = ({ profile }) => {
  const tabValue = useValue('1');
  return (
    <Box
      sx={{
        '.MuiTabPanel-root': {
          p: 0,
        },
      }}
    >
      <TabContext value={tabValue.get}>
        <TabList sx={{ display: 'flex' }} onChange={(e, v) => tabValue.set(v)}>
          <Tab label='게시물' value='1' sx={{ flex: 1 }} />
          <Tab label='답글' value='2' sx={{ flex: 1 }} />
          <Tab label='미디어' value='3' sx={{ flex: 1 }} />
          <Tab label='마음에들어요' value='4' sx={{ flex: 1 }} />
        </TabList>
        <Divider sx={{ mb: 0.5 }} />
        <TabPanel value='1'>
          <PostTimeline
            getter={API.Posts.post.getUserTimeline(profile.username)}
            type={profile.username}
          />
        </TabPanel>
        <TabPanel value='2'>답글</TabPanel>
        <TabPanel value='3'>
          <MediaTimeline
            getter={API.Posts.post.getUserMediaItems(profile.username)}
            type={`media/${profile.username}`}
          />
        </TabPanel>
        <TabPanel value='4'>
          <PostTimeline
            getter={API.Posts.post.getFavoriteItems(profile.username)}
            type={`favorites/${profile.username}`}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default ProfileTab;
