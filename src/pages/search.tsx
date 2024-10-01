import API from '#/api';
import { Paginated } from '#/api/general';
import { User } from '#/api/users/types';
import { ClientOnlyHOC } from '#/components/ClientOnlyHOC';
import TextInput from '#/components/inputs/TextInput';
import { SimpleProfileItem } from '#/components/SimpleProfileComponent';
import { PostTimeline } from '#/components/timelines';
import { useCursorPagination } from '#/hooks/paginations/useCursorPagination';
import { useRouter } from '#/hooks/useCRouter';
import { useObserver } from '#/hooks/useObserver';
import useValue from '#/hooks/useValue';
import paths from '#/paths';
import DraftEditor from '#/PostWriter/DraftEditor';
import { glassmorphism } from '#/styles';
import { filterDuplicate } from '#/utils/arrays';
import { Search } from '@mui/icons-material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {
  Box,
  Tab,
  Avatar,
  Divider,
  useTheme,
  TextField,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { AxiosResponse } from 'axios';
import React, { SyntheticEvent, useEffect, useMemo, useRef } from 'react';
import { atom, useRecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();
const searchTabAtom = atom({
  key: 'homeTabAtom',
  default: '1',
  effects_UNSTABLE: [persistAtom],
});

const useSearchTabAtom = () => {
  const [get, set] = useRecoilState(searchTabAtom);
  return { get, set };
};

const UserSearchComponent: React.FC<{ search: string }> = ({ search }) => {
  const router = useRouter();
  const searchKey = useValue(search);
  const fetchBlockRef = useRef<HTMLElement>();
  const observer = useObserver();
  const { data: users, fetchNext } = useCursorPagination({
    getter: API.Users.users,
    params: { search },
    apiKey: 'userSearch',
  });

  useEffect(() => {
    const block = fetchBlockRef.current;
    if (!block) return;
    observer.onIntersection(fetchNext);
    observer.observe(block);
    return () => observer.unobserve(block);
  }, [searchKey.get, users]);

  return (
    <Stack spacing={1}>
      {users.map((user) => (
        <SimpleProfileItem
          key={user.id}
          profile={user}
          onClick={() => router.push(paths.mypage(user.username))}
        />
      ))}
      <Box ref={fetchBlockRef} />
    </Stack>
  );
};

const SearchPage: ExtendedNextPage = () => {
  const theme = useTheme();
  const tabValue = useSearchTabAtom();

  const search = useValue('');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    tabValue.set(newValue);
  };
  return (
    <Box sx={{}}>
      <TabContext value={tabValue.get}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            backdropFilter: 'blur(5px)',
            zIndex: 5,
          }}
        >
          <Box px={2} pt={2}>
            <TextInput
              value={search.get}
              onChange={search.onTextChange}
              size='small'
              fullWidth
              placeholder='Search'
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Search />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 5 },
                },
              }}
            />
          </Box>
          <TabList
            onChange={handleChange}
            aria-label='lab API tabs example'
            sx={{
              button: { minWidth: '50%' },
              borderLeftWidth: '0px',
              borderRightWidth: '0px',
              borderBottomWidth: '0px',
              borderTopWidth: '0px',
              borderStyle: 'solid',
              borderColor: theme.palette.divider,
            }}
          >
            <Tab label='게시글' value='1' />
            <Tab label='유저' value='2' />
          </TabList>
        </Box>
        <TabPanel
          value='1'
          sx={{
            p: 0,
          }}
        >
          {search.get && (
            <PostTimeline
              getter={API.Posts.post.getGlobalTimeline}
              params={{ search: search.get }}
              type='searchPosts'
            />
          )}
        </TabPanel>
        <TabPanel
          value='2'
          sx={{
            p: 0,
          }}
        >
          {search.get && <UserSearchComponent search={search.get} />}
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default ClientOnlyHOC(SearchPage);
