import { TimeLinePaginated } from '#/api/general';
import { Post } from '#/api/posts';
import { useKeepScrollPosition } from '#/hooks/useKeepScrollPosition';
import { useObserver } from '#/hooks/useObserver';
import useValue from '#/hooks/useValue';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { AxiosResponse } from 'axios';
import React, {
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { PostItem } from './PostItem';
import { useTimelinePagination } from './usePostPagination';
import { filterDuplicate } from '#/utils/arrays';

export const PostTimeline: React.FC<{
  getter: (
    params?: {},
    options?: { offset?: string | number }
  ) => Promise<AxiosResponse<TimeLinePaginated<Post>>>;
  type: string;
  keepScrollPosition?: boolean;
  showParent?: boolean;
  disableLatestRepost?: boolean;
  params?: {};
  fetchNew?: MutableRefObject<() => void>;
  pollingWhenEmpty?: boolean;
}> = ({
  getter,
  type,
  keepScrollPosition = true,
  showParent = false,
  disableLatestRepost = false,
  pollingWhenEmpty = true,
  params = {},
  fetchNew,
}) => {
  useKeepScrollPosition(type, keepScrollPosition);

  const {
    data: items,
    getNextPage,
    newData,
    mergeDatas,
    getPrevPage,
  } = useTimelinePagination({
    func: getter,
    apiKey: type,
    params,
    pollingWhenEmpty,
  });

  const observer = useObserver();
  const nextCallblock = useRef<HTMLDivElement>();
  useEffect(() => {
    if (!nextCallblock.current) return;
    const block = nextCallblock.current;
    observer.onIntersection(getNextPage);
    observer.observe(block);
    0;
    return () => observer.unobserve(block);
  }, [items]);

  //이전글 강제로 가져오는 기능
  const fetch = useValue(false);
  useImperativeHandle(
    fetchNew,
    () => () => {
      getPrevPage().then(() => fetch.set(true));
    },
    [getPrevPage, mergeDatas]
  );

  useEffect(() => {
    if (!fetch.get) return;
    const timeout = setTimeout(() => {
      mergeDatas();
      fetch.set(false);
    }, 100);
    return () => clearTimeout(timeout);
  }, [fetch.get, mergeDatas]);

  const newDataUsers = useMemo(
    () => filterDuplicate(newData.map((d) => d.user)),
    [newData]
  );

  return (
    <Stack spacing={1}>
      {1 <= newData.length && (
        <Stack
          alignItems='center'
          spacing={2}
          pt={2}
          onClick={mergeDatas}
          sx={(theme) => ({
            width: '100%',
            cursor: 'pointer',
            ':hover': { bgcolor: theme.palette.action.hover },
          })}
        >
          <Stack
            spacing={1}
            direction='row'
            justifyContent='center'
            alignItems='center'
          >
            <AvatarGroup max={3}>
              {newDataUsers.map(({ profile_image, nickname }) => (
                <Avatar alt={nickname} src={profile_image?.small} />
              ))}
            </AvatarGroup>
            <Typography pl={2} color='primary'>
              {newData.length} 게시글 보기
            </Typography>
          </Stack>
          <Divider flexItem />
        </Stack>
      )}
      {filterDuplicate(items).map((post) => (
        <PostItem
          key={post.id}
          post={post}
          showParent={showParent}
          disableLatestRepost={disableLatestRepost}
        />
      ))}
      <Box ref={nextCallblock} />
    </Stack>
  );
};
