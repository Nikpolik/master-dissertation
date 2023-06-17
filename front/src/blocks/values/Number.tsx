import { BlockEntry, InputType, registerBlock, PrimitiveBlocks, blockStateAtomFamily } from 'core';
import { useRecoilValue } from 'recoil';

function NumberBlock({ id }: { id: string }) {
  const { value } = useRecoilValue(blockStateAtomFamily(id));
  const parsedValue = Number(value);

  return parsedValue;
}

const numberEntry: BlockEntry = {
  block: NumberBlock,
  inputsSettings: {},
  type: InputType.number,
  name: 'Number',
  category: 'Values',
};

registerBlock(PrimitiveBlocks.number, numberEntry);
