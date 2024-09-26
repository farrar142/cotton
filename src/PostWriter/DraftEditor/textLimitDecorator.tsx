import {
  ContentBlock,
  ContentState,
  DraftDecoratorComponentProps,
  CompositeDecorator,
  DraftDecorator,
} from 'draft-js';

// 300글자 이상일 때 스타일을 적용하는 함수
export const findOverLimitText =
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
export const OverLimitSpan: React.FC<DraftDecoratorComponentProps> = (
  props
) => {
  return <span style={{ color: 'red' }}>{props.children}</span>;
};

export const textLimitDecorator = (limit: number): DraftDecorator => ({
  strategy: findOverLimitText(limit),
  component: OverLimitSpan,
});
