import { library } from '@fortawesome/fontawesome-svg-core';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputType, PrimitiveBlocks, registerBlock, useInputs } from 'core';

function isDefinition(icon: Icons.IconDefinition | Icons.IconPack | Icons.IconPrefix): icon is Icons.IconDefinition {
  return typeof (icon as any).prefix !== 'undefined';
}

const options = Object.keys(Icons);

interface IconChildren {
  icon: string;
}

const inputsSettings = {
  icon: {
    type: [InputType.string],
    defaultBlock: PrimitiveBlocks.string,
    options,
    label: 'Icon',
    order: 0,
  },
};

function Icon({ id }: { id: string }) {
  const { icon } = useInputs<IconChildren>(id);

  const definitionOrPrefix = (Icons as any)[icon];
  if (!definitionOrPrefix || !isDefinition(definitionOrPrefix)) {
    return <></>;
  }

  const definition = definitionOrPrefix as Icons.IconDefinition;
  // we can make sure we only a add a single library onceoncce.
  // Consider if we can collect/remove unsued icons if this is to heavy
  library.add(definition);

  return <FontAwesomeIcon icon={definition.iconName} />;
}

registerBlock('icon', {
  block: Icon,
  inputsSettings,
  type: InputType.block,
  name: 'Icon',
  category: 'Misc',
});

export default Icon;
