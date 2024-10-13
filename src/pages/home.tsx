import { Avatar, Box, Button, Divider, useTheme } from '@mui/material';

import DraftEditor, { DraftOnPost } from '#/PostWriter/DraftEditor';
import API from '#/api';
import { CommonTab } from '#/components/layouts/CommonTab';
import { PostTimeline } from '#/components/timelines';
import { usePostWriteService } from '#/hooks/posts/usePostWriteService';
import { useKeyScrollPosition } from '#/hooks/useKeepScrollPosition';
import { useLoginWindow } from '#/hooks/useLoginWindow';
import useMediaSize from '#/hooks/useMediaSize';
import useUser from '#/hooks/useUser';
import { SyntheticEvent, useRef } from 'react';
import { atom, useRecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import React from 'react';
import { useRouter } from '#/hooks/useCRouter';
import { URL } from 'url';

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

const Home: ExtendedNextPage = () => {
  const { isMd } = useMediaSize();
  const theme = useTheme();
  const [user] = useUser();
  const tabValue = useHomeTabAtom();
  const [openLoginWindow] = useLoginWindow();
  const [_, setScrollPosition] = useKeyScrollPosition();
  const postWriteService = usePostWriteService();

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    if (!user) return openLoginWindow();
    tabValue.set(newValue);
  };

  const fetchNew = useRef(() => {});

  const onPost: DraftOnPost = (text, blocks, images) => {
    return postWriteService
      .onPost(text, blocks, images)
      .then(() => fetchNew.current());
  };
  const router = useRouter();
  return (
    <Box sx={{}}>
      <CommonTab
        labels={[
          {
            label: 'Recommended',
            value: '추천',
            onClick: (e) => {
              if (e.currentTarget.tabIndex !== 0) return;
              setScrollPosition({ key: 'global', value: 0 });
            },
          },
          user
            ? {
                label: 'Following',
                value: '팔로우 중',
                onClick: (e) => {
                  if (e.currentTarget.tabIndex !== 0) return;
                  setScrollPosition({ key: 'followings', value: 0 });
                },
              }
            : undefined,
        ]}
        panels={[
          <PostTimeline
            key='global'
            getter={API.Posts.post.getGlobalTimeline}
            type='global'
            // fetchNew={fetchNew}
            disablePrevfetch
          />,
          <PostTimeline
            key='followings'
            getter={API.Posts.post.getFollowingTimeline}
            type='followings'
            fetchNew={fetchNew}
          />,
        ]}
        sharedTopSlot={
          user && (
            <>
              <Box
                py={2}
                px={isMd ? 2 : 1}
                display='flex'
                flexDirection='row'
                width='100%'
              >
                <Avatar
                  sx={{ mr: 1 }}
                  src={user?.profile_image?.small || user?.profile_image?.url}
                />
                <DraftEditor onPost={onPost} additionalWidth={-48} />
              </Box>
              <Divider sx={{ width: '100%' }} flexItem />
            </>
          )
        }
        pannelProps={{ sx: { p: 0 } }}
      />
    </Box>
  );
};
Home.getMeta = () => ({ title: 'Home' });
export default Home;
