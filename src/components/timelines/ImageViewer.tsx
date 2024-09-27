import { ImageType } from '#/api/commons/types';
import { Post } from '#/api/posts';
import useValue, { UseValue } from '#/hooks/useValue';
import { ArrowBack, ArrowForward, Close } from '@mui/icons-material';
import {
  Backdrop,
  Box,
  Dialog,
  Grid2,
  IconButton,
  useTheme,
} from '@mui/material';
import { CSSProperties, useEffect, useMemo } from 'react';

const OriginalImageViewer: React.FC<{
  post: Post;
  index: UseValue<number>;
}> = ({ post, index }) => {
  const theme = useTheme();
  const image = post.images[index.get];
  const open = Boolean(image);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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
    <Backdrop
      open={open}
      onClick={() => index.set(-1)}
      sx={{ width: '100%', height: '100%' }}
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
    </Backdrop>
  );
};

const ImageItem: React.FC<{
  image: ImageType;
  onClick: () => void;
  width: string;
  height: string;
  objectFit?: 'fill' | 'cover' | 'contain';
  type?: 'handled' | 'auto';
  styles?: CSSProperties;
}> = ({
  image,
  width,
  height,
  onClick,
  objectFit = 'cover',
  type = 'handled',
  styles,
}) => {
  const imgProps =
    type === 'handled'
      ? {
          width: '100%',
          height: '100%',
          style: { objectFit, ...styles },
        }
      : {
          width: 'auto',
          height: 'auto',
          style: {
            objectFit,
            borderRadius: 15,
            maxHeight: '100%',
            maxWidth: '100%',
            ...styles,
          },
        };
  return (
    <Box key={image.id} onClick={onClick} width={width} height={height}>
      <img src={image.large || image.url} alt='' {...imgProps} />
    </Box>
  );
};

export const ImageViewer: React.FC<{ post: Post }> = ({ post }) => {
  const images = post.images;
  const selectedImage = useValue<number>(-1);
  const [width, height] = useMemo(() => {
    if (images.length <= 1) return ['100%', '100%'];
    if (images.length === 2) return ['50%', '100%'];
    return ['100%', '50%'];
  }, [images]);
  const aspectRatio = '1.6';
  if (images.length === 0) return <></>;
  return (
    <Box
      display='flex'
      flexDirection='row'
      width='100%'
      sx={{ aspectRatio, borderRadius: 15 }}
    >
      {images.length === 1 && (
        <Box sx={{ width: '100%', height: '100%', maxHeight: 400 }}>
          <ImageItem
            image={images[0]}
            width='100%'
            height='100%'
            objectFit='contain'
            type='auto'
            onClick={() => selectedImage.set(0)}
          />
        </Box>
      )}
      {images.length === 2 && (
        <Box
          width='100%'
          sx={{ aspectRatio }}
          display='flex'
          flexDirection='row'
        >
          <ImageItem
            image={images[0]}
            width={width}
            height={height}
            onClick={() => selectedImage.set(0)}
            styles={{ borderTopLeftRadius: 15, borderBottomLeftRadius: 15 }}
          />
          <ImageItem
            image={images[1]}
            width={width}
            height={height}
            onClick={() => selectedImage.set(1)}
            styles={{ borderTopRightRadius: 15, borderBottomRightRadius: 15 }}
          />
        </Box>
      )}
      {images.length === 3 && (
        <Box
          width='100%'
          sx={{ aspectRatio }}
          display='flex'
          flexDirection='row'
        >
          <Box width='50%' height='100%'>
            <ImageItem
              image={images[0]}
              width='100%'
              height='100%'
              onClick={() => selectedImage.set(0)}
              styles={{ borderTopLeftRadius: 15, borderBottomLeftRadius: 15 }}
            />
          </Box>
          <Box width='50%' height='100%'>
            <ImageItem
              image={images[1]}
              width='100%'
              height='50%'
              onClick={() => selectedImage.set(1)}
              styles={{ borderTopRightRadius: 15 }}
            />
            <ImageItem
              image={images[2]}
              width='100%'
              height='50%'
              onClick={() => selectedImage.set(2)}
              styles={{ borderBottomRightRadius: 15 }}
            />
          </Box>
        </Box>
      )}
      {images.length === 4 && (
        <Box
          width='100%'
          sx={{ aspectRatio }}
          display='flex'
          flexDirection='row'
        >
          <Box width='50%' height='100%'>
            <ImageItem
              image={images[0]}
              width='100%'
              height='50%'
              onClick={() => selectedImage.set(0)}
              styles={{ borderTopLeftRadius: 15 }}
            />
            <ImageItem
              image={images[1]}
              width='100%'
              height='50%'
              onClick={() => selectedImage.set(1)}
              styles={{ borderBottomLeftRadius: 15 }}
            />
          </Box>
          <Box width='50%' height='100%'>
            <ImageItem
              image={images[2]}
              width='100%'
              height='50%'
              onClick={() => selectedImage.set(2)}
              styles={{ borderTopRightRadius: 15 }}
            />
            <ImageItem
              image={images[3]}
              width='100%'
              height='50%'
              onClick={() => selectedImage.set(3)}
              styles={{ borderBottomRightRadius: 15 }}
            />
          </Box>
        </Box>
      )}
      <OriginalImageViewer post={post} index={selectedImage} />
    </Box>
  );
};
