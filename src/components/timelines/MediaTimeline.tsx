import { ImageType } from '#/api/commons/types';
import { Paginated } from '#/api/general';
import { Box, Grid2, useMediaQuery, useTheme } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useEffect, useMemo } from 'react';
import { atomFamily, useRecoilState } from 'recoil';
import { ImageItem } from './ImageItem';
import { Post } from '#/api/posts';
import { usePostList } from './hooks';
import { FilterNone } from '@mui/icons-material';
import { OriginalImageViewer } from './OriginalImageViewer';
import useValue from '#/hooks/useValue';
import { useKeepScrollPosition } from '#/hooks/useKeepScrollPosition';

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
        src={sampleImage.medium || sampleImage.url}
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

export const MediaTimeline: React.FC<{
  getter: (
    params?: {},
    options?: { page: number | string }
  ) => Promise<AxiosResponse<Paginated<Post>>>;
  type: string;
  keepScrollPosition?: boolean;
}> = ({ getter, type, keepScrollPosition = true }) => {
  useKeepScrollPosition(type, keepScrollPosition);
  const [items, setItems] = usePostList(type);

  useEffect(() => {
    if (0 < items.length) return;
    getter()
      .then(({ data }) => data.results)
      .then(setItems);
  }, []);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box px={0.5}>
      <Grid2 container spacing={0.5}>
        {items.map((item, index) => (
          <Grid2 size={isSmall ? 4 : 3} key={item.id} sx={{ aspectRatio: '1' }}>
            <MergedPostMedia item={item} />
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};
