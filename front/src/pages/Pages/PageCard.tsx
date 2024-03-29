import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import { Card, CardActions, CardHeader, IconButton, Typography, CardContent } from '@mui/material';
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Page } from '../state';
import DeletePage from './DeletePage';

interface PageCardProps {
  page: Page;
}

const LinkWrapper = forwardRef((props: any, ref) => {
  return <Link ref={ref} to={props.href} {...props} />;
});

const StyledCard = styled(Card)`
  width: 320px;
  display: flex;
  flex-direction: column;
`;

const StyledCardActions = styled(CardActions)`
  margin-top: auto;
`;

function PageCard(props: PageCardProps) {
  const { id, pageName, createdAt, description } = props.page;
  const formattedDate = new Date(createdAt * 1000).toLocaleDateString();
  const shareUrl = new URL(`/public/${id}`, window.location.href).href;

  return (
    <StyledCard data-cy="pages-card">
      <CardHeader title={pageName} subheader={`Created: ${formattedDate}`} />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <StyledCardActions disableSpacing>
        <IconButton target="_blank" href={shareUrl} data-cy="pages-share-button">
          <ShareIcon />
        </IconButton>
        <IconButton data-cy="pages-edit-button" LinkComponent={LinkWrapper} href={`${id}/edit`}>
          <EditIcon />
        </IconButton>
        <DeletePage id={id} />
      </StyledCardActions>
    </StyledCard>
  );
}

export default PageCard;
