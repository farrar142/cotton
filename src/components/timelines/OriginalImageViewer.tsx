import { Post } from '#/api/posts';
import useValue, { UseValue } from '#/hooks/useValue';
import {
  ArrowBack,
  ArrowForward,
  Close,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from '@mui/icons-material';
import { Box, Collapse, IconButton, useTheme } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { ScrollPreventedBackdrop } from '../utils/ScrollPreventedBackdrop';
import React from 'react';
import useMediaSize from '#/hooks/useMediaSize';
import { PostDetailItem } from '../layouts/pages/PostDetailPage/PostDetailItem';

export const OriginalImageViewer: React.FC<{
  post: Post;
  index: UseValue<number>;
}> = ({ post, index }) => {
  const theme = useTheme();
  const { isSmall, isMd } = useMediaSize();
  const isPostView = useValue(true);

  const image = post.images[index.get];
  const open = Boolean(image);

  useEffect(() => {
    if (!isMd) return;
    isPostView.set(false);
  }, [isMd]);

  const hasPrev = useMemo(() => {
    if (index.get === 0) return false;
    return true;
  }, [index.get]);
  const hasNext = useMemo(() => {
    if (post.images.length - 1 <= index.get) return false;

    return true;
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
      <Box
        width='100%'
        height='100%'
        display='flex'
        flexDirection='row'
        alignItems='center'
        position='relative'
      >
        <Box
          height='100%'
          width='100%'
          display='flex'
          justifyContent='center'
          alignItems='center'
          position='relative'
          px={4}
        >
          <img
            onClick={(e) => e.stopPropagation()}
            src={image.url}
            alt=''
            style={{ maxWidth: '100%', width: theme.breakpoints.values.md }}
          />
          <IconButton
            sx={{
              position: 'absolute',
              top: '5%',
              left: '5%',
              bgcolor: 'background.paper',
              transform: 'translate(0,-50%)',
            }}
          >
            <Close />
          </IconButton>
          {hasNext && (
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
          )}
          {hasPrev && (
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
          )}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              isPostView.set((p) => !p);
            }}
            sx={{
              position: 'absolute',
              top: '5%',
              right: '5%',
              transform: 'translate(0,-50%)',
              bgcolor: 'background.default',
            }}
          >
            {!isPostView.get ? (
              <KeyboardDoubleArrowLeft />
            ) : (
              <KeyboardDoubleArrowRight />
            )}
          </IconButton>
        </Box>
        {isPostView.get && (
          <Box
            maxWidth={theme.breakpoints.values.xs}
            width='100%'
            height='100%'
            bgcolor='background.default'
            sx={{
              borderLeftStyle: 'solid',
              borderLeftColor: 'divider',
              borderLeftWidth: 1,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <PostDetailItem post={post} />
          </Box>
        )}
      </Box>
    </ScrollPreventedBackdrop>
  );
};
