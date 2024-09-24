// src/Tiptap.tsx
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import {
  HtmlEditor,
  Image,
  Inject,
  Link,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar,
  MarkdownEditor,
} from '@syncfusion/ej2-react-richtexteditor';

import { MentionComponent } from '@syncfusion/ej2-react-dropdowns';
import React, { createRef, useEffect, useRef, useState } from 'react';
import { useMention } from './useMention';
import { User } from '#/api/users/types';
import API from '#/api';
import { NodeParser } from '#/utils/textEditor/editor';
import useValue from '#/hooks/useValue';

const RichtexEditor: React.FC<{ maxLength?: number }> = ({
  maxLength = 300,
}) => {
  const componentRef = createRef<RichTextEditorComponent>();
  const textLength = useValue(0);
  const mention = useMention();
  const [user, setUser] = useState<User[]>([]);
  let dataFields: Object = { text: 'username' };
  const searchUser = (search?: string) =>
    API.Users.users({ search })
      .then(({ data: { results } }) => setUser(results))
      .catch(() => {});
  useEffect(() => {
    searchUser();
  }, []);

  const theme = useTheme();
  const inputChange = (e: Event) => {
    //@ts-ignore
    const length = (e.currentTarget.textContent || '').length;
    textLength.set(length);
  };
  useEffect(() => {
    const e = document.getElementById('mention_integration_rte-edit-view');
    if (!e) return;
    const editor = e;
    editor.addEventListener('keyup', inputChange);
    return () => {
      editor.removeEventListener('keyup', inputChange);
    };
  }, []);

  return (
    <Box
      sx={{
        '.e-toolbar-wrapper': {
          display: 'none',
          visibility: 'hidden',
        },
        '.e-richtexteditor': {
          background: 'transparent',
        },
        '.e-richtexteditor .e-rte-content, .e-richtexteditor .e-source-content':
          {
            color: theme.palette.text.primary,
            background: 'transparent',
          },
      }}
    >
      <RichTextEditorComponent
        placeholder='무슨 일이 일어나고 있나요?'
        ref={componentRef}
        id='mention_integration'
        showTooltip={false}
        // toolbarSettings={{ items: [] }}
        actionBegin={mention.actionBegineHandler.bind(this)}
      >
        <Inject services={[Toolbar, Image, Link, HtmlEditor, QuickToolbar]} />
      </RichTextEditorComponent>
      <MentionComponent
        ref={(scope) => {
          mention.mentionObj.current = scope;
        }}
        id='mentionEditor'
        target='#mention_integration_rte-edit-view'
        suggestionCount={8}
        showMentionChar={false}
        allowSpaces={true}
        dataSource={user}
        fields={dataFields}
        popupWidth='250px'
        popupHeight='200px'
        itemTemplate={mention.itemTemplate}
        displayTemplate={mention.displayTemplate}
        filtering={(e: { text: string }) => {
          searchUser(e.text);
        }}
      ></MentionComponent>
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
        <Button
          onClick={() => {
            if (!componentRef.current) return;
            const data = componentRef.current.getContent();
            const parser = new NodeParser(data);
            parser.parseNode();
          }}
        >
          저장
        </Button>
      </Stack>
    </Box>
  );
};

export default RichtexEditor;
