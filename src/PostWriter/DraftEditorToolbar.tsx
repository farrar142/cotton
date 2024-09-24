import { UseValue } from '#/hooks/useValue';
import { DraftContentParser } from '#/utils/textEditor/draftParser';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { convertToRaw, EditorState } from 'draft-js';
import { MouseEventHandler, useEffect } from 'react';

const DraftEditorToolbar: React.FC<{
  textLength: UseValue<number>;
  maxLength: number;
  editorState: EditorState;
}> = ({ textLength, maxLength, editorState }) => {
  const onPost: MouseEventHandler = (e) => {
    e.preventDefault();
    const content = editorState.getCurrentContent();
    const converted = convertToRaw(content);
    const parser = new DraftContentParser(converted);
    parser.parseToTextBlocks();
  };

  return (
    <Stack direction='row' spacing={1} alignItems='center' m={1}>
      <CircularProgress
        variant='determinate'
        value={(textLength.get * 100) / maxLength}
      />
      <Typography
        variant='caption'
        component='div'
        sx={{ color: 'text.secondary' }}
      >
        {textLength.get}/{maxLength}
      </Typography>
      <Button onClick={onPost}>게시</Button>
    </Stack>
  );
};

export default DraftEditorToolbar;
