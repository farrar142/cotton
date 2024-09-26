import {
  ContentState,
  EditorState,
  Modifier,
  RichUtils,
  SelectionState,
} from 'draft-js';

export const applyStyleToBlocks = (
  editorState: EditorState,
  startBlockIndex: number
) => {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const blocksArray = contentState.getBlocksAsArray();
  const newContentState = blocksArray.reduce((cs, block, index) => {
    if (index < startBlockIndex) return cs;
    return Modifier.applyInlineStyle(
      cs,
      cs
        .getSelectionAfter()
        .merge({ anchorKey: block.getKey(), anchorOffset: 0 }),
      'RED'
    );
  }, contentState);
  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    'change-inline-style'
  );
  return EditorState.acceptSelection(newEditorState, selection);
};

const colorInitializedState = (editorState: EditorState) => {
  const selection = editorState.getSelection();
  return Object.keys(styleMap).reduce((state, color) => {
    const blockArray = state.getBlocksAsArray();
    for (const block of blockArray) {
      state = Modifier.removeInlineStyle(
        state,
        selection.merge({
          anchorKey: block.getKey(),
          anchorOffset: 0,
          focusKey: block.getKey(),
          focusOffset: block.getLength(),
        }),
        color
      );
    }
    return state;
  }, editorState.getCurrentContent());
};

export const styleMap = {
  RED: {
    color: 'red',
  },
};
