import { ImageType } from '#/api/commons/types';
import { Grid2 } from '@mui/material';
import { useMemo } from 'react';

export const ImageViewer: React.FC<{ images: ImageType[] }> = ({ images }) => {
  const gridValue = useMemo(() => {
    if (images.length <= 1) return 12;
    return 6;
  }, [images]);
  if (images.length === 0) return <></>;
  return (
    <Grid2 container spacing={1}>
      {images.map((image) => (
        <Grid2 size={gridValue} key={image.id}>
          <img
            src={image.large || image.url}
            alt=''
            style={{ objectFit: 'cover', borderRadius: 15 }}
            width='100%'
            height='100%'
          />
        </Grid2>
      ))}
    </Grid2>
  );
};
