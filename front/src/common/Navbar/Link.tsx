import { styled, Button } from '@mui/material';
import { ReactNode } from 'react';
import { LinkProps as RouterLinkProps, Link as RouterLink } from 'react-router-dom';

const Container = styled(RouterLink)`
  text-decoration: none;
  color: white;
`;

interface LinkProps extends RouterLinkProps {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

function Link(props: LinkProps) {
  const { children, endIcon, startIcon, ...rest } = props;

  return (
    <Container {...rest}>
      <Button endIcon={endIcon} startIcon={startIcon} variant="contained">
        {children}
      </Button>
    </Container>
  );
}

export default Link;
