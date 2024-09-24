import { Block, MentionBlock, TextBlock } from './blockTypes';

export class NodeParser {
  node: Node;
  constructor(node: Element) {
    this.node = node;
  }
  parseNode() {
    const paragaphNodes = this.node.childNodes[0].childNodes;
    const blocksList = [...paragaphNodes].map((pNode, i) => {
      const walker = document.createTreeWalker(pNode, NodeFilter.SHOW_TEXT);
      let currentNode: Node | null;
      const blocks: Block[] = [];
      while ((currentNode = walker.nextNode())) {
        const block = this._parse(currentNode);
        blocks.push(block);
      }
      return blocks;
    });
    return blocksList;
  }
  _parse(node: Node) {
    const parent = node.parentElement;
    const text = node.textContent;
    if (!parent || !text) throw Error;
    if (parent.classList.contains('mention'))
      return this._parseMention(parent, text);
    return this._parseText(parent, text);
  }
  _parseText(node: Element, text: string): TextBlock {
    return { type: 'text', value: text };
  }
  _parseMention(node: Element, text: string): MentionBlock {
    const username = node.getAttribute('data-username') || '';
    const id = node.getAttribute('data-id') || '';

    return { type: 'mention', value: text, username, id };
  }
}
