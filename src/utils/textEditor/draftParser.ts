import {
  ContentState,
  convertFromRaw,
  EditorState,
  RawDraftContentBlock,
  RawDraftContentState,
  RawDraftEntity,
  RawDraftEntityRange,
} from 'draft-js';
import { Block, MentionBlock } from './blockTypes';

export class DraftContentParser {
  private content: RawDraftContentState;
  constructor(content: RawDraftContentState) {
    this.content = content;
  }
  parseToTextBlocks() {
    const blocks = this.content.blocks;
    const textBlocksList = blocks.map((block) => {
      const textBlocks: Block[] = [];
      let textBlock: Block | undefined = undefined;
      for (let i = 0; i < block.text.length; i++) {
        const entityResult = this.isEntityIndex(i, block.entityRanges);
        if (entityResult.result) {
          if (textBlock) {
            textBlocks.push(textBlock);
            textBlock = undefined;
          }
          i += entityResult.length;
          if (entityResult.entity.type === 'mention') {
            textBlocks.push(
              this.parseBlock(block.text, entityResult.entityRange)
            );
          }
          continue;
        }
        if (!textBlock) textBlock = { type: 'text', value: '' };
        textBlock.value += block.text[i];
      }
      if (textBlock) textBlocks.push(textBlock);
      return textBlocks;
    });
    return textBlocksList;
  }
  parseBlock(text: string, entityRange: RawDraftEntityRange) {
    const entity = this.content.entityMap[entityRange.key];
    if (entity.type === 'mention') {
      return this.__parseMentionBlock(text, entityRange, entity);
    }
    throw Error;
  }
  private __parseMentionBlock(
    text: string,
    entityRange: RawDraftEntityRange,
    entity: RawDraftEntity
  ): MentionBlock {
    return {
      type: 'mention',
      value: this.sliceStringSafe(
        text,
        entityRange.offset,
        entityRange.offset + entityRange.length
      ),
      username: entity.data.mention.username,
      id: entity.data.mention.id,
    };
  }

  isEntityIndex(index: number, entities: RawDraftEntityRange[]) {
    for (const entity of entities) {
      if (entity.offset <= index && index <= entity.offset + entity.length) {
        return {
          result: true,
          length: entity.length,
          entityRange: entity,
          entity: this.content.entityMap[entity.key],
        } as const;
      }
    }
    return {
      result: false,
      length: 0,
      entityRange: null,
      entity: null,
    } as const;
  }
  sliceStringSafe(chars: string, start: number, end: number) {
    let char: string = '';
    for (let i = start; i <= end; i++) {
      char += chars[i];
    }
    return char;
  }
  static blocksToContentState = (blocks: Block[][]): ContentState => {
    const rawBlocks: RawDraftContentBlock[] = [];
    const entityMap: { [key: number]: RawDraftEntity } = {};
    for (const [index, lines] of blocks.entries()) {
      let charCount = 0;
      let text = '';
      let entityKey = 0;
      const entityRanges: RawDraftEntityRange[] = [];
      for (const block of lines) {
        const [charStart, charEnd] = [
          charCount,
          charCount + block.value.length,
        ];
        charCount = charEnd;
        text += block.value;
        if (block.type === 'mention') {
          entityRanges.push({
            key: entityKey,
            offset: charStart,
            length: block.value.length,
          });
          entityMap[entityKey] = {
            data: {
              mention: {
                username: block.username,
                id: block.id,
              },
            },
            type: 'mention',
            mutability: 'IMMUTABLE',
          };
          entityKey += 1;
        }
        text += ' ';
        charCount += 1;
      }
      const key = `${index}`;
      const type = 'unstyled';
      rawBlocks.push({
        key,
        type,
        text,
        depth: 0,
        entityRanges,
        inlineStyleRanges: [],
      });
    }
    return convertFromRaw({ blocks: rawBlocks, entityMap });
  };
}
