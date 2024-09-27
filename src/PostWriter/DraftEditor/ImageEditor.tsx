import { ImageType } from '#/api/commons/types';
import useValue, { UseValue } from '#/hooks/useValue';
import { combination } from '#/utils/combinations';
import { ArrowBack, ArrowForward, Close } from '@mui/icons-material';
import { Box, Grid2, IconButton } from '@mui/material';
import { useEffect, useMemo } from 'react';
import Carousel from 'react-material-ui-carousel';

const ImageItem: React.FC<{
  image: ImageType;
  onDelete: (image: ImageType) => void;
  readOnly?: boolean;
}> = ({ image, onDelete }) => (
  <Box position='relative' width='100%'>
    <img
      src={image.url}
      alt=''
      width='100%'
      draggable={false}
      style={{ borderRadius: 15 }}
    />
    <IconButton
      onClick={() => onDelete(image)}
      sx={{
        position: 'absolute',
        top: 5,
        right: 5,
        bgcolor: 'background.paper',
      }}
    >
      <Close />
    </IconButton>
  </Box>
);

const ImageEditor: React.FC<{
  images: UseValue<ImageType[]>;
}> = ({ images }) => {
  const onDelete = (image: ImageType) => {
    images.set((p) =>
      p.filter((img) => !(img.id === image.id && img.url === image.url))
    );
  };

  const showElement = useMemo(() => {
    if (images.get.length <= 1)
      return images.get.map((image, key) => (
        <ImageItem
          image={image}
          key={`${key}:${image.url}`}
          onDelete={onDelete}
        />
      ));
    else {
      return combination(images.get).map((elems, index) => (
        <Grid2 container key={`${index}`} spacing={1}>
          {elems.map((image, key) => (
            <Grid2 size={6} key={`${key}:${image.url}`}>
              <ImageItem
                image={image}
                key={`${index}:${key}:${image.url}`}
                onDelete={onDelete}
              />
            </Grid2>
          ))}
        </Grid2>
      ));
    }
  }, [images.get]);

  const index = useValue(0);
  const prevButton = useMemo(() => {
    if (showElement.length <= 1) return;
    return (
      <IconButton
        onClick={() => index.set((i) => i - 1)}
        sx={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translate(0,-50%)',
          bgcolor: 'background.paper',
        }}
      >
        <ArrowBack />
      </IconButton>
    );
  }, [showElement]);
  const nextButton = useMemo(() => {
    if (showElement.length <= 1) return;
    return (
      <IconButton
        onClick={() => index.set((i) => i + 1)}
        sx={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translate(0,-50%)',
          bgcolor: 'background.paper',
        }}
      >
        <ArrowForward />
      </IconButton>
    );
  }, [showElement]);
  useEffect(() => {
    if (index.get < 0) index.set((p) => showElement.length - 1);
    else if (showElement.length <= index.get) index.set((p) => 0);
  }, [index.get, showElement]);
  return (
    <Box position='relative'>
      {showElement[index.get]}
      {prevButton}
      {nextButton}
    </Box>
  );
};

export default ImageEditor;
