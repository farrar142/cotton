import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import API from '#/api';
import useValue from '#/hooks/useValue';
import { Block } from '#/utils/textEditor/blockTypes';
import { DraftContentParser } from '#/utils/textEditor/draftParser';
// import Editor from '@draft-js-plugins/editor';
import createImagePlugin from '@draft-js-plugins/image';
import createMentionPlugin, { MentionData } from '@draft-js-plugins/mention';
import { Box, Divider, Stack, useTheme } from '@mui/material';
import { convertFromRaw, convertToRaw, EditorState, Modifier } from 'draft-js';
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
import { glassmorphism } from '#/styles';
import { atom, atomFamily, useRecoilState } from 'recoil';
import dynamic from 'next/dynamic';

const Editor = dynamic(
  //@ts-ignore
  () => import('@draft-js-plugins/editor').then((d) => d.default),
  { ssr: false }
);

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

type ReadOnly = {
  readOnly: true;
  onPost?: undefined;
};
type EditOnly = {
  readOnly?: undefined;
  onPost: (
    text: string,
    blocks: Block[][],
    images: ImageType[]
  ) => Promise<any>;
};

const editorAtom = atomFamily<EditorState, string>({
  key: 'editorAtom',
  default: (key: string) => {
    try {
      const parsed = JSON.parse(key);
      return EditorState.createWithContent(
        DraftContentParser.blocksToContentState(parsed)
      );
    } catch {
      return EditorState.createWithContent(emptyContentState);
    }
  },
});
const imageAtom = atomFamily<ImageType[], string>({
  key: 'imageAtom',
  default: (key) => [],
});

const useEditorState = (key?: string) => {
  return useRecoilState(editorAtom(key ? key : 'undefined'));
};
const useImage = (key: string) => {
  const [get, set] = useRecoilState(imageAtom(key));
  return { get, set, onTextChange: () => {}, onNumberChange: () => {} };
};
const DraftEditor: React.FC<
  {
    maxLength?: number;
    blocks?: Block[][];
    additionalWidth?: number;
    editorKey?: string;
    placeholder?: string;
  } & (ReadOnly | EditOnly)
> = ({
  maxLength = 300,
  onPost,
  blocks,
  readOnly = false,
  additionalWidth = 0,
  editorKey, //cache용 같은키의 에디터가 두개있을시 오류발생하니 주의
  placeholder,
}) => {
  const theme = useTheme();
  const key = useMemo(
    () => (blocks ? JSON.stringify(blocks) : editorKey) || 'undefined',
    [blocks, editorKey]
  );
  // const editorRef = useRef<typeof Editor>(null);
  const [editorState, setEditorState] = useEditorState(key);
  const [suggestions, setSuggestions] = useState<MentionData[]>([]);
  const images = useImage(key);
  const textLength = useValue(0);
  const getInitialEditorState = () =>
    blocks
      ? EditorState.createWithContent(
          DraftContentParser.blocksToContentState(blocks)
        )
      : EditorState.createWithContent(emptyContentState);

  // const [editorState, setEditorState] = useState(getInitialEditorState);

  //mentions
  const { plugins, MentionSuggestions } = useMemo(() => {
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
  const onPostText = () => {
    if (readOnly || !onPost) return;
    const content = editorState.getCurrentContent();
    const plainText = content.getPlainText();
    const converted = convertToRaw(content);
    const parser = new DraftContentParser(converted);
    const blocks = parser.parseToTextBlocks();
    onPost(plainText, blocks, images.get).then(() => {
      setEditorState(getInitialEditorState);
      images.set([]);
    });
  };

  const onEmojiClick = (emoji: string) => {
    const cs = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const newState = Modifier.insertText(cs, selection, emoji);
    const newEditorState = EditorState.push(
      editorState,
      newState,
      'insert-characters'
    );
    setEditorState(newEditorState);
    handleTextLength(newEditorState, textLength, maxLength);
  };
  return (
    <Stack
      spacing={1}
      flex={1}
      sx={{
        'div[role="listbox"]': {
          py: 0.5,
          minWidth: '200px',
          width: '200px',
          div: {
            cursor: 'pointer',
          },
          zIndex: 1000,
          ...glassmorphism(theme),
        },
        width: `calc(100% + ${additionalWidth}px);`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/** tslint:disable */}
      <Editor
        // ref={editorRef}
        editorState={editorState}
        plugins={plugins}
        onChange={(e) => {
          setEditorState(e);
          handleTextLength(e, textLength, maxLength);
        }}
        placeholder={placeholder || '무슨 일이 일어나고 있나요?'}
        customStyleMap={styleMap}
        readOnly={readOnly}
      />
      <MentionSuggestions
        open={open}
        onOpenChange={onOpenChange}
        suggestions={suggestions}
        onSearchChange={onSearchChange}
        onAddMention={(mention) => {
          console.log(mention);
          // get the mention object selected
        }}
        entryComponent={MentionEntry}
      />
      <ImageEditor images={images} />
      {readOnly === false && (
        <DraftEditorToolbar
          maxLength={maxLength}
          textLength={textLength}
          editorState={editorState}
          onPost={onPostText}
          images={images}
          onEmojiClick={onEmojiClick}
        />
      )}
    </Stack>
  );
};

export default DraftEditor;
//
