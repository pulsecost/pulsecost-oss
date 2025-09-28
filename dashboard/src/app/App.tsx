import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { router } from './routes';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
