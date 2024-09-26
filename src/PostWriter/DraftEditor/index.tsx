import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  EditorState,
  ContentState,
  convertFromRaw,
  convertToRaw,
  ContentBlock,
  CompositeDecorator,
  DraftDecorator,
  DraftDecoratorComponentProps,
} from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, {
  defaultSuggestionsFilter,
  MentionPluginTheme,
  MentionData,
} from '@draft-js-plugins/mention';
import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/mention/lib/plugin.css';
import mentionsStyles from './MentionsStyles.module.css';
import API from '#/api';
import { User } from '#/api/users/types';
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { SubMentionComponentProps } from '@draft-js-plugins/mention/lib/Mention';
import useValue from '#/hooks/useValue';
import DraftEditorToolbar from './Toolbar';
import { handleTextLength } from './functions';
import { styleMap } from './plugins';
import { textLimitDecorator } from './textLimitDecorator';
import { userToMentonData, MentionEntry, MentionComponent } from './mention';

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

const DraftEditor: React.FC<{ maxLength?: number }> = ({ maxLength = 300 }) => {
  const theme = useTheme();
  const editorRef = useRef<Editor>(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(emptyContentState)
  );
  const [suggestions, setSuggestions] = useState<MentionData[]>([]);
  const textLength = useValue(0);

  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      entityMutability: 'IMMUTABLE',
      theme: mentionsStyles,
      mentionPrefix: '@',
      supportWhitespace: true,
      mentionComponent: MentionComponent,
    });
    const { MentionSuggestions } = mentionPlugin;
    mentionPlugin.decorators = [textLimitDecorator(maxLength)];
    const plugins = [mentionPlugin];
    return { plugins, MentionSuggestions };
  }, []);

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
  const onPost = () => {
    API;
  };

  return (
    <Box
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
        '.DraftEditor-root': {
          minHeight: '100px',
        },
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
      <DraftEditorToolbar
        maxLength={maxLength}
        textLength={textLength}
        editorState={editorState}
      />
    </Box>
  );
};

export default DraftEditor;
//
