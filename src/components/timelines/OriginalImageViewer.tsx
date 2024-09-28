import { Post } from '#/api/posts';
import { UseValue } from '#/hooks/useValue';
import { ArrowBack, ArrowForward, Close } from '@mui/icons-material';
import { Box, IconButton, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { ScrollPreventedBackdrop } from '../utils/ScrollPreventedBackdrop';

export const OriginalImageViewer: React.FC<{
  post: Post;
  index: UseValue<number>;
}> = ({ post, index }) => {
  const theme = useTheme();
  const image = post.images[index.get];
  const open = Boolean(image);

  const hasPrev = useMemo(() => {
    if (index.get === 0) return;
    return (
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          index.set((p) => p - 1);
        }}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '5%',
          transform: 'translate(0,-50%)',
          bgcolor: 'background.default',
        }}
      >
        <ArrowBack />
      </IconButton>
    );
  }, [index.get]);
  const hasNext = useMemo(() => {
    if (post.images.length - 1 <= index.get) return;

    return (
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          index.set((p) => p + 1);
        }}
        sx={{
          position: 'absolute',
          top: '50%',
          right: '5%',
          transform: 'translate(0,-50%)',
          bgcolor: 'background.default',
        }}
      >
        <ArrowForward />
      </IconButton>
    );
  }, [index.get]);
  if (!open) return <></>;
  return (
    <ScrollPreventedBackdrop
      open={open}
      onClick={(e) => {
        e.stopPropagation();
        index.set(-1);
      }}
    >
      <IconButton
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          bgcolor: 'background.paper',
        }}
      >
        <Close />
      </IconButton>
      <Box width='100%' display='flex' justifyContent='center'>
        <img
          onClick={(e) => e.stopPropagation()}
          src={image.url}
          alt=''
          style={{ maxWidth: theme.breakpoints.values.md }}
        />
      </Box>
      {hasPrev}
      {hasNext}
    </ScrollPreventedBackdrop>
  );
};
