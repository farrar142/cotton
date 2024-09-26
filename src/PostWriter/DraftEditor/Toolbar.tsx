import useUser from '#/hooks/useUser';
import { UseValue } from '#/hooks/useValue';
import { DraftContentParser } from '#/utils/textEditor/draftParser';
import {
  Button,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { convertToRaw, EditorState } from 'draft-js';
import { MouseEventHandler, useEffect, useMemo } from 'react';

const DraftEditorToolbar: React.FC<{
  textLength: UseValue<number>;
  maxLength: number;
  editorState: EditorState;
}> = ({ textLength, maxLength, editorState }) => {
  const [user] = useUser();
  const isTextOver = maxLength < textLength.get;
  const onPost: MouseEventHandler = (e) => {
    e.preventDefault();
    const content = editorState.getCurrentContent();
    const converted = convertToRaw(content);
    const parser = new DraftContentParser(converted);
    parser.parseToTextBlocks();
  };
  const [share, displayLength] = useMemo(() => {
    const remainder = textLength.get % maxLength;
    const share = Math.floor(textLength.get / maxLength);
    if (1 <= share && remainder === 0) return [share, maxLength];
    return [share, remainder];
  }, [textLength.get, maxLength]);
  return (
    <Stack direction='row' spacing={1} alignItems='center' m={1}>
      <CircularProgress
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
      <Button onClick={onPost} disabled={isTextOver || !Boolean(user)}>
        게시
      </Button>
    </Stack>
  );
};

export default DraftEditorToolbar;
