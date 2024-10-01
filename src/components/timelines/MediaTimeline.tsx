import { Paginated, TimeLinePaginated } from '#/api/general';
import { Post } from '#/api/posts';
import { useKeepScrollPosition } from '#/hooks/useKeepScrollPosition';
import useValue from '#/hooks/useValue';
import { FilterNone } from '@mui/icons-material';
import { Box, Grid2, useMediaQuery, useTheme } from '@mui/material';
import { AxiosResponse } from 'axios';
import React, { useEffect, useMemo, useRef } from 'react';
import { IntersectingOnly } from '../utils/IntersectingOnly';
import { usePostList } from './hooks';
import { OriginalImageViewer } from './OriginalImageViewer';
import { useTimelinePagination } from './usePostPagination';
import { useObserver } from '#/hooks/useObserver';

const MergedPostMedia: React.FC<{ item: Post }> = ({ item }) => {
  const index = useValue(-1);
  const sampleImage = useMemo(() => item.images[0], []);
  const hasMultipleImages = useMemo(
    () => item.images.length > 1,
    [item.images]
  );
  if (!sampleImage) return <>Error</>;

  return (
    <Box
      width='100%'
      height='100%'
      position='relative'
      sx={{ cursor: 'position' }}
      onClick={() => index.set(0)}
    >
      <img
        src={sampleImage.large || sampleImage.url}
        alt=''
        height='100%'
        width='100%'
        style={{ objectFit: 'cover' }}
      />
      {hasMultipleImages && (
        <FilterNone
          fontSize='small'
          sx={{ position: 'absolute', bottom: '5%', right: '5%' }}
        />
      )}
      <OriginalImageViewer post={item} index={index} />
    </Box>
  );
};

const _MediaTimeline: React.FC<{
  getter: (
    params?: {},
    options?: { offset?: number | string }
  ) => Promise<AxiosResponse<TimeLinePaginated<Post>>>;
  type: string;
  keepScrollPosition?: boolean;
}> = ({ getter, type, keepScrollPosition = true }) => {
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
    params: {},
  });
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));

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

  return (
    <Box px={0.5}>
      <Grid2 container spacing={0.5}>
        {items.map((item, index) => (
          <Grid2 size={isSmall ? 4 : 3} key={item.id} sx={{ aspectRatio: '1' }}>
            <MergedPostMedia item={item} />
          </Grid2>
        ))}
      </Grid2>
      <Box ref={nextCallblock} />
    </Box>
  );
};
export const MediaTimeline = IntersectingOnly(_MediaTimeline);
