export type MentionBlock = {
  type: 'mention';
  value: string;
  username: string;
  id: string;
};

export type TextBlock = {
  type: 'blank' | 'text';
  value: string;
};

export type Block = TextBlock | MentionBlock;
export type CursorPosition = {
  totalPosition: number;
  currentPosition: number;
  currentNode: Node;
};
