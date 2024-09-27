import useUser from '#/hooks/useUser';
import useValue, { UseValue } from '#/hooks/useValue';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { Image } from '@mui/icons-material';
import { EditorState } from 'draft-js';
import { ChangeEventHandler, createRef, useMemo } from 'react';
import { getBase64 } from '#/utils/images/getBase64';
import { resizeImage } from '#/utils/images/resizeImage';
import { ImageType } from '#/api/commons/types';

const DraftEditorToolbar: React.FC<{
  images: UseValue<ImageType[]>;
  textLength: UseValue<number>;
  maxLength: number;
  editorState: EditorState;
  onPost: () => void;
}> = ({ textLength, maxLength, images, editorState, onPost }) => {
  const [user] = useUser();
  const inputRef = createRef<HTMLInputElement>();

  const isTextOver = useMemo(
    () => maxLength < textLength.get,
    [maxLength, textLength]
  );

  const [share, displayLength] = useMemo(() => {
    const remainder = textLength.get % maxLength;
    const share = Math.floor(textLength.get / maxLength);
    if (1 <= share && remainder === 0) return [share, maxLength];
    return [share, remainder];
  }, [textLength.get, maxLength]);

  const onImageButtonClick = () => {
    if (!inputRef.current) return;
    inputRef.current.click();
  };
  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    const availableImageLength = 4 - images.get.length;
    const blobs = [...(e.target.files || [])].filter(
      (file, index) => index <= availableImageLength
    );
    e.currentTarget.value = '';
    e.target.value = '';
    if (blobs.length === 0) return;
    const files = Promise.all(blobs.map((file) => getBase64(file)));
    const resized = files.then((files) =>
      Promise.all(files.map((file) => resizeImage(file, 1024)))
    );
    const typed: Promise<ImageType[]> = resized.then((files) =>
      files.map((url) => ({ id: -1, url }))
    );
    typed.then((imgs) => images.set((p) => [...p, ...imgs]));
  };

  return (
    <Box width='100%' display='flex' justifyContent='space-between'>
      <Stack direction='row' spacing={1} alignItems='center'>
        <IconButton size='small' color='info' onClick={onImageButtonClick}>
          <Image sx={{ width: 25, height: 25 }} />
          <input
            ref={inputRef}
            multiple
            type='file'
            accept='image/png, image/gif, image/jpeg'
            onChange={onInputChange}
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </IconButton>
      </Stack>
      <Stack direction='row' spacing={1} alignItems='center' m={1}>
        <CircularProgress
          size='25px'
          color={Boolean(share) ? 'error' : 'primary'}
          variant='determinate'
          value={(displayLength * 100) / maxLength}
        />
        <Typography
          variant='caption'
          component='div'
          sx={{ color: Boolean(share) ? 'error.main' : 'text.secondary' }}
        >
          {textLength.get}/{maxLength}
        </Typography>
        <Button
          variant='contained'
          sx={{ borderRadius: 10 }}
          onClick={onPost}
          disabled={isTextOver || !Boolean(user) || textLength.get === 0}
        >
          게시
        </Button>
      </Stack>
    </Box>
  );
};

export default DraftEditorToolbar;
