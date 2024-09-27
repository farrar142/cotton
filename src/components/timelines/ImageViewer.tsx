import { ImageType } from '#/api/commons/types';
import { Post } from '#/api/posts';
import useValue, { UseValue } from '#/hooks/useValue';
import { Close } from '@mui/icons-material';
import { Backdrop, Dialog, Grid2, IconButton } from '@mui/material';
import { useEffect, useMemo } from 'react';

const OriginalImageViewer: React.FC<{
  post: Post;
  index: UseValue<number>;
}> = ({ post, index }) => {
  const image = post.images[index.get];
  const open = Boolean(image);

  return (
    <Backdrop
      open={open}
      onClick={() => index.set(-1)}
      sx={{ width: '100%', height: '100%' }}
    >
      <IconButton sx={{ position: 'absolute', top: 10, left: 10 }}>
        <Close />
      </IconButton>
    </Backdrop>
  );
};

export const ImageViewer: React.FC<{ post: Post }> = ({ post }) => {
  const images = post.images;
  const selectedImage = useValue<number>(-1);
  const gridValue = useMemo(() => {
    if (images.length <= 1) return 12;
    return 6;
  }, [images]);
  if (images.length === 0) return <></>;
  return (
    <Grid2 container spacing={1}>
      {images.map((image, index) => (
        <Grid2
          size={gridValue}
          key={image.id}
          onClick={() => selectedImage.set(index)}
        >
          <img
            src={image.large || image.url}
            alt=''
            style={{ objectFit: 'cover', borderRadius: 15 }}
            width='100%'
            height='100%'
          />
        </Grid2>
      ))}
      <OriginalImageViewer post={post} index={selectedImage} />
    </Grid2>
  );
};
