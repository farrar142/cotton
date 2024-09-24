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
import DraftEditorToolbar from './DraftEditorToolbar';

export interface EntryComponentProps {
  className?: string;
  onMouseDown: MouseEventHandler<HTMLDivElement>;
  onMouseUp: MouseEventHandler<HTMLDivElement>;
  onMouseEnter: MouseEventHandler<HTMLDivElement>;
  role: string;
  id: string;
  'aria-selected'?: boolean | 'false' | 'true';
  theme?: MentionPluginTheme;
  mention: MentionData;
  isFocused: boolean;
  searchValue?: string;
}

const Entry: React.FC<EntryComponentProps> = (props) => {
  const {
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    mention,
    theme,
    searchValue, // eslint-disable-line @typescript-eslint/no-unused-vars
    isFocused, // eslint-disable-line @typescript-eslint/no-unused-vars
    ...parentProps
  } = props;
  return (
    <Box
      id={props.id}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
      onClick={onMouseDown}
      bgcolor='transparent'
      //   className={theme?.mentionSuggestions}
      sx={{
        bgcolor: isFocused ? 'var(--mention-selected)' : 'inherit',
      }}
    >
      <Typography
        component='span'
        data-type='mention'
        data-username={mention.username}
        data-id={mention.id}
        className='mention'
        sx={{ color: 'primary.main' }}
      >
        @{mention.username}
      </Typography>
    </Box>
  );
};
`data-offset-key="notmodified-1-0"`;
const MentionComponent: React.FC<SubMentionComponentProps> = (e) => {
  console.log(e);
  //@ts-ignore
  const key = e.children[0].key;
  return (
    <span
      className={e.className}
      spellCheck={false}
      data-testid='mentionText'
      style={{ cursor: 'pointer' }}
      onClick={() => {
        console.log(e.mention);
      }}
    >
      <span data-offset-key={key}>
        <span data-text={true}>@{e.mention.username}</span>
      </span>
    </span>
  );
};

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

const userToMentonData = (user: User): MentionData => ({
  ...user,
  name: user.username,
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
          height: '100px',
        },
      }}
    >
      <Editor
        ref={editorRef}
        editorState={editorState}
        plugins={plugins}
        onChange={(e) => {
          setEditorState(e);
          const { blocks } = convertToRaw(e.getCurrentContent());
          const mappedBlocks = blocks.map(
            (block) => (!block.text.trim() && '\n') || block.text
          );
          const content = mappedBlocks.reduce((acc, block) => {
            let returned = acc;
            if (block === '\n') returned += block;
            else returned += `${block}\n`;
            return returned;
          }, '');
          textLength.set(content.length);
        }}
        placeholder='무슨 일이 일어나고 있나요?'
      />
      <MentionSuggestions
        open={open}
        onOpenChange={onOpenChange}
        suggestions={suggestions}
        onSearchChange={onSearchChange}
        onAddMention={() => {
          // get the mention object selected
        }}
        entryComponent={Entry}
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
