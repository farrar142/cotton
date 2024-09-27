import useValue from '#/hooks/useValue';
import { ArrowBack, Close } from '@mui/icons-material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  Divider,
  Fade,
  IconButton,
  Paper,
  Stack,
  Tab,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import DraftEditor from '#/PostWriter/DraftEditor';
import API from '#/api';
import CommonLayout from '#/components/layouts/CommonLayout';
import { Block } from '#/utils/textEditor/blockTypes';
import { SyntheticEvent, useEffect, useRef } from 'react';
import { Post } from '#/api/posts';
import { PostTimeline } from '#/components/timelines';
import useUser from '#/hooks/useUser';
import { useLoginWindow } from '#/hooks/useLoginWindow';
import { ImageType } from '#/api/commons/types';
// import PostWriter from '#/PostWriter';
// const DraftEditor = dynamic(() => import('#/PostWriter/DraftEditor'), {
//   ssr: true,
// });

const Home = () => {
  const theme = useTheme();
  const [user] = useUser();
  const tabValue = useValue('1');
  const [openLoginWindow] = useLoginWindow();

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    if (!user) return openLoginWindow();
    tabValue.set(newValue);
  };
  const onPost = (text: string, blocks: Block[][], images: ImageType[]) => {
    const mentions = blocks
      .map((line) => line.filter((block) => block.type === 'mention'))
      .flatMap((block) => block)
      .map((block) => ({ mentioned_to: parseInt(block.id) }));
    return API.Posts.post.postItem({ text, blocks, mentions, images });
  };

  return (
    <Box>
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
              borderLeftWidth: '1px',
              borderRightWidth: '1px',
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
            borderWidth: '1px',
            borderColor: theme.palette.divider,
            borderStyle: 'solid',
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
            borderWidth: '1px',
            borderColor: theme.palette.divider,
            borderStyle: 'solid',
          }}
        >
          <Box px={2} display='flex' flexDirection='row'>
            <Avatar sx={{ mr: 1 }} />
            <DraftEditor onPost={onPost} additionalWidth={-48} />
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
