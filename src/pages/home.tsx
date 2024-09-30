import useValue from '#/hooks/useValue';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Avatar, Box, Divider, Tab, useTheme } from '@mui/material';

import DraftEditor from '#/PostWriter/DraftEditor';
import API from '#/api';
import { ImageType } from '#/api/commons/types';
import { PostTimeline } from '#/components/timelines';
import { useLoginWindow } from '#/hooks/useLoginWindow';
import useMediaSize from '#/hooks/useMediaSize';
import useUser from '#/hooks/useUser';
import { Block } from '#/utils/textEditor/blockTypes';
import { SyntheticEvent } from 'react';
import { usePostWriteService } from '#/hooks/posts/usePostWriteService';
import { atom, useRecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();
// import PostWriter from '#/PostWriter';
// const DraftEditor = dynamic(() => import('#/PostWriter/DraftEditor'), {
//   ssr: true,
// });
const homeTabAtom = atom({
  key: 'homeTabAtom',
  default: '1',
  effects_UNSTABLE: [persistAtom],
});

const useHomeTabAtom = () => {
  const [get, set] = useRecoilState(homeTabAtom);
  return { get, set };
};

const Home = () => {
  const { isMd } = useMediaSize();
  const theme = useTheme();
  const [user] = useUser();
  const tabValue = useHomeTabAtom();
  const [openLoginWindow] = useLoginWindow();
  const postWriteService = usePostWriteService();

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    if (!user) return openLoginWindow();
    tabValue.set(newValue);
  };

  return (
    <Box sx={{}}>
      <TabContext value={user ? tabValue.get : '1'}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            backdropFilter: 'blur(5px)',
            zIndex: 2,
          }}
        >
          <TabList
            onChange={handleChange}
            aria-label='lab API tabs example'
            sx={{
              button: { width: '50%' },
              borderLeftWidth: '0px',
              borderRightWidth: '0px',
              borderBottomWidth: '0px',
              borderTopWidth: '0px',
              borderStyle: 'solid',
              borderColor: theme.palette.divider,
            }}
          >
            <Tab label='추천' value='1' />
            <Tab label='팔로우 중' value='2' />
          </TabList>
        </Box>
        <TabPanel
          value='1'
          sx={{
            p: 0,
          }}
        >
          <PostTimeline
            getter={API.Posts.post.getGlobalTimeline}
            type='global'
          />
        </TabPanel>
        <TabPanel
          value='2'
          sx={{
            p: 0,
            pt: 2,
          }}
        >
          <Box px={isMd ? 2 : 1} display='flex' flexDirection='row'>
            <Avatar sx={{ mr: 1 }} />
            <DraftEditor
              onPost={postWriteService.onPost}
              additionalWidth={-48}
            />
          </Box>
          <Divider sx={{ mb: 1 }} />
          <PostTimeline
            getter={API.Posts.post.getFollowingTimeline}
            type='followings'
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
};
export default Home;
