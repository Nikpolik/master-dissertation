import { Home } from '@mui/icons-material';
import { useAuth } from 'auth/hooks';
import { Fragment } from 'react';

import Link from './Link';
import PublishPageButton from './PublishPageButton';
import RefreshPageButton from './RefreshPageButton';
import SavePageButton from './SavePageButton';
import ToggleEditorButton from './ToggleEditorButton';
import { Item, Container, Divider } from './styles';

function Navbar() {
  const { token } = useAuth();

  return (
    <Container>
      <ToggleEditorButton />
      {token && (
        <Fragment>
          <Item>
            <Link endIcon={<Home />} to="/pages">
              Pages
            </Link>
          </Item>
          <Item>
            <Link endIcon={<Home />} to="/media">
              Media
            </Link>
          </Item>
          <Divider />
          <PublishPageButton />
          <RefreshPageButton />
          <SavePageButton />
          <Item>
            <Link to="/logout">Logout</Link>
          </Item>
        </Fragment>
      )}
      {!token && (
        <Fragment>
          <Divider />
          <Item>
            <Link to="/register">Register</Link>
          </Item>
          <Item>
            <Link to="/login">Login</Link>
          </Item>
        </Fragment>
      )}
    </Container>
  );
}

export default Navbar;
