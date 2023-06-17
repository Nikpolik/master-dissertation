import { BlockPickerProps } from '.';
import InputTitle from './InputTitle';
import { Container, Header } from './styles';

interface ObjectInputProps extends BlockPickerProps {}

function ObjectInput(props: ObjectInputProps) {
  return (
    <Container depth={props.depth || 0}>
      <Header>
        <InputTitle
          parentId={props.parentId}
          object={true}
          label={props.config.label}
          showName={true}
          blockName="Object"
        />
      </Header>
    </Container>
  );
}

export default ObjectInput;
