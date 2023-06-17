import { InputType, PrimitiveBlocks, registerBlock } from 'core';

function Empty() {
  return null;
}

registerBlock(PrimitiveBlocks.empty, {
  block: Empty,
  inputsSettings: {},
  type: InputType.any,
  name: 'Empty',
  category: 'Values',
});
