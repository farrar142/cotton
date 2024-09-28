import API from '#/api';
import { User } from '#/api/users/types';
import { PostTimeline } from '#/components/timelines';
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
        <Box>
          <TabList>
            <Tab label='게시물' value='1' />
          </TabList>
        </Box>
        <Divider />
        <TabPanel value='1'>
          <PostTimeline
            getter={API.Posts.post.getUserTimeline(profile.username)}
            type={profile.username}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default ProfileTab;
