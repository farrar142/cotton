import { UseValue } from '#/hooks/useValue';
import {
  ContentBlock,
  ContentState,
  convertToRaw,
  EditorState,
} from 'draft-js';
import { applyStyleToBlocks } from './plugins';

export const handleTextLength = (
  e: EditorState,
  textLength: UseValue<number>,
  maxLength: number
) => {
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
  textLength.set(content.trim().length);
};
