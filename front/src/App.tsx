import { ThemeProvider } from '@mui/material';
import Login from 'auth/pages/Login';
import Logout from 'auth/pages/Logout';
import Register from 'auth/pages/Register';
import PrivateRoute from 'auth/routes/PrivateRoute';
import GlobalStyles from 'globalStyles';
import Media from 'media/Media';
import Page from 'pages/Page';
import Public from 'pages/Public';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Normalize } from 'styled-normalize';
import { Reset } from 'styled-reset';

import theme from 'common/theme';

import './blocks';
import Navbar from './components/Navbar';
import Pages from './pages/Pages';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Normalize />
        <Reset />
        <GlobalStyles />
        <Routes>
          <Route
            path="login"
            element={
              <>
                <Navbar />
                <Login />
              </>
            }
          />
          <Route
            path="register"
            element={
              <>
                <Navbar />
                <Register />
              </>
            }
          />
          <Route
            path="/logout"
            element={
              <PrivateRoute redirect="/login">
                <Navbar />
                <Logout />
              </PrivateRoute>
            }
          />
          <Route path="pages">
            <Route
              index
              element={
                <PrivateRoute redirect="/login">
                  <Navbar />
                  <Pages />
                </PrivateRoute>
              }
            />
            <Route path=":id">
              <Route
                path="edit"
                element={
                  <PrivateRoute redirect="/login">
                    <Navbar />
                    <Page />
                  </PrivateRoute>
                }
              />
              <Route path="public" element={<Public />} />
            </Route>
          </Route>
          <Route path="media">
            <Route
              index
              element={
                <PrivateRoute redirect="/login">
                  <Navbar />
                  <Media />
                </PrivateRoute>
              }
            />
          </Route>
          <Route index element={<Navigate to="/pages" />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
