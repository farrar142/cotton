import { Post } from '#/api/posts';
import useValue from '#/hooks/useValue';
import { Box } from '@mui/material';
import { useMemo } from 'react';
import { ImageItem } from './ImageItem';
import { OriginalImageViewer } from './OriginalImageViewer';
import React from 'react';

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
      onClick={(e) => e.stopPropagation()}
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
