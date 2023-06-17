import { Typography } from '@mui/material';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Card = styled.form`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  padding: 24px;
  gap: 32px;
  border-radius: 8px;
  border: 1px solid lightgrey;
  background-color: white;
`;

const ErrorText = styled.div`
  margin: 8px 0;
  color: red;
`;

const Title = styled(Typography)`
  text-align: center;
  font-size: 22px;
`;

export { Container, Card, ErrorText, Title };
