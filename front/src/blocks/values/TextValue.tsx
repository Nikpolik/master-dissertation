import { registerBlock, BlockEntry, getPrimitiveValue, InputType, PrimitiveBlocks } from 'core';

function Text({ id }: { id: string }) {
  return getPrimitiveValue(id) || '';
}

const textEntry: BlockEntry = {
  block: Text,
  inputsSettings: {},
  type: InputType.string,
  name: 'Text',
  category: 'Values',
};

const textareaEntry: BlockEntry = {
  ...textEntry,
  name: 'Textarea',
};

registerBlock(PrimitiveBlocks.string, textEntry);
registerBlock(PrimitiveBlocks.textarea, textareaEntry);
