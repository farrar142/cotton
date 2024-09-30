import { ImageType } from '#/api/commons/types';
import { Box, styled } from '@mui/material';
import { CSSProperties } from 'react';

const ClickableImage = styled('img')({ cursor: 'pointer' });

export const ImageItem: React.FC<{
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
    <Box key={image.id} width={width} height={height}>
      <ClickableImage
        onClick={onClick}
        src={image.large || image.url}
        alt=''
        {...imgProps}
      />
    </Box>
  );
};
