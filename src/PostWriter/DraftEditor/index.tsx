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

// 300글자 이상일 때 스타일을 적용하는 함수
const findOverLimitText =
  (limit: number) =>
  (
    contentBlock: ContentBlock,
    callback: (max: number, currentLength: number) => void,
    contentState: ContentState
  ) => {
    const blocksArray = contentState.getBlocksAsArray();
    blocksArray.reduce((count, block) => {
      const [blockStart, blockEnd] = [count, count + block.getText().length];

      if (block.getKey() !== contentBlock.getKey()) return blockEnd;
      if ((blockStart <= limit && limit <= blockEnd) || limit < blockStart) {
        const text = contentBlock.getText();
        console.log(limit, blockStart);
        callback(Math.max(limit - blockStart, 0), text.length);
      }
      return blockEnd;
    }, 0);
  };

// 데코레이터 컴포넌트
const OverLimitSpan: React.FC<DraftDecoratorComponentProps> = (props) => {
  return <span style={{ color: 'red' }}>{props.children}</span>;
};

const decorator = (limit: number) =>
  new CompositeDecorator([
    {
      strategy: findOverLimitText(limit),
      component: OverLimitSpan,
    },
  ]);
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
    mentionPlugin.decorators = [decorator(maxLength)];
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
