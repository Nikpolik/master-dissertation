import EditIcon from '@mui/icons-material/Edit';
import { Card, CardActions, IconButton, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material';
import styled from 'styled-components';

import { createStaticURL } from 'common/request';

import { Asset } from './state';
import DeleteMedia from './DeleteMedia';

const StyledCard = styled(Card)`
  width: 320px;
  display: flex;
  flex-direction: column;
`;

const StyledCardActions = styled(CardActions)`
  margin-top: auto;
`;

interface MediaCardProps {
  asset: Asset;
  onClick: (id: string) => void;
}

function MediaCard(props: MediaCardProps) {
  const { onClick, asset } = props;
  const { name, url, description } = asset;

  function handleClick() {
    onClick(asset.id);
  }

  return (
    <StyledCard data-cy="media-card">
      <CardActionArea onClick={handleClick}>
        <CardMedia component="img" height="194" image={createStaticURL(url)} alt="Paella dish" />
      </CardActionArea>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <StyledCardActions disableSpacing>
        <IconButton data-cy="media-edit-button" onClick={handleClick}>
          <EditIcon />
        </IconButton>
        <DeleteMedia id={asset.id}/>
      </StyledCardActions>
    </StyledCard>
  );
}

export default MediaCard;
