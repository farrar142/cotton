import React, { useCallback, useRef, useState } from 'react';

import API from '#/api';
import useValue from '#/hooks/useValue';
import { Block } from '#/utils/textEditor/blockTypes';
import { DraftContentParser } from '#/utils/textEditor/draftParser';
import Editor from '@draft-js-plugins/editor';
import createImagePlugin from '@draft-js-plugins/image';
import createMentionPlugin, { MentionData } from '@draft-js-plugins/mention';
import { Box, Divider, Stack, useTheme } from '@mui/material';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import mentionsStyles from './MentionsStyles.module.css';
import DraftEditorToolbar from './Toolbar';
import { handleTextLength } from './functions';
import { MentionComponent, MentionEntry, userToMentonData } from './mention';
import { styleMap } from './plugins';
import { textLimitDecorator } from './textLimitDecorator';

import '@draft-js-plugins/mention/lib/plugin.css';
import '@draft-js-plugins/image/lib/plugin.css';
import 'draft-js/dist/Draft.css';
import ImageEditor from './ImageEditor';
import { ImageType } from '#/api/commons/types';

const emptyContentState = convertFromRaw({
  entityMap: {},
  blocks: [
    {
      text: '',
      key: 'notmodified',
      type: 'unstyled',
      entityRanges: [],
      depth: 0,
      inlineStyleRanges: [],
    },
  ],
});

const mentionPlugin = createMentionPlugin({
  entityMutability: 'IMMUTABLE',
  theme: mentionsStyles,
  mentionPrefix: '@',
  supportWhitespace: true,
  mentionComponent: MentionComponent,
});

const { MentionSuggestions } = mentionPlugin;
mentionPlugin.decorators = [
  ...(mentionPlugin.decorators || []),
  textLimitDecorator(300),
];
const imagePlugin = createImagePlugin();
const plugins = [mentionPlugin, imagePlugin];

const DraftEditor: React.FC<{
  maxLength?: number;
  readOnly?: boolean;
  onPost: (text: string, blocks: Block[][]) => void;
  blocks?: Block[][];
  images?: ImageType[];
}> = ({
  maxLength = 300,
  onPost,
  blocks,
  readOnly = false,
  images: _images = [],
}) => {
  const theme = useTheme();
  const editorRef = useRef<Editor>(null);
  const [editorState, setEditorState] = useState(() =>
    blocks
      ? EditorState.createWithContent(
          DraftContentParser.blocksToContentState(blocks)
        )
      : EditorState.createWithContent(emptyContentState)
  );
  const [suggestions, setSuggestions] = useState<MentionData[]>([]);
  const images = useValue<ImageType[]>(_images);
  const textLength = useValue(0);

  const [open, setOpen] = useState(false);
  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open);
  }, []);
  const onSearchChange = ({ value }: { value: string }) => {
    API.Users.users({ search: value })
      .then((r) => r.data.results)
      .then((d) => d.map(userToMentonData))
      .then(setSuggestions);
    // setSuggestions(defaultSuggestionsFilter(value, mentions));
  };
  const onPostText = () => {
    const content = editorState.getCurrentContent();
    const plainText = content.getPlainText();
    const converted = convertToRaw(content);
    const parser = new DraftContentParser(converted);
    const blocks = parser.parseToTextBlocks();
    onPost(plainText, blocks);
  };
  return (
    <Stack
      spacing={1}
      sx={{
        'div[role="listbox"]': {
          bgcolor: theme.palette.background.default,
          py: 3,
          minWidth: '200px',
          width: '200px',
          borderColor: 'transparent',
          borderTopColor: 'transparent',
          div: {
            cursor: 'pointer',
          },
          zIndex: 10,
        },
        width: '100%',
      }}
    >
      <Editor
        ref={editorRef}
        editorState={editorState}
        plugins={plugins}
        onChange={(e) => {
          setEditorState(e);
          handleTextLength(e, textLength, maxLength);
        }}
        placeholder='무슨 일이 일어나고 있나요?'
        customStyleMap={styleMap}
        readOnly={readOnly}
      />
      <MentionSuggestions
        open={open}
        onOpenChange={onOpenChange}
        suggestions={suggestions}
        onSearchChange={onSearchChange}
        onAddMention={() => {
          // get the mention object selected
        }}
        entryComponent={MentionEntry}
      />
      <ImageEditor images={images} />
      {readOnly === false && (
        <Box>
          <Divider />
          <DraftEditorToolbar
            maxLength={maxLength}
            textLength={textLength}
            editorState={editorState}
            onPost={onPostText}
            images={images}
          />
        </Box>
      )}
    </Stack>
  );
};

export default DraftEditor;
//
