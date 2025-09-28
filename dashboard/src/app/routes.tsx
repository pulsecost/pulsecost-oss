import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import CommunityLayout from '../components/CommunityLayout';
import Home from '../pages/Home';
import Logs from '../pages/Logs';
import Config from '../pages/Config';
import ApiKeys from '../pages/ApiKeys';

const Layout: React.FC = () => {
  return <CommunityLayout />;
};

export const router: any = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'analytics',
        element: <Home />,
      },
      {
        path: 'logs',
        element: <Logs />,
      },
      {
        path: 'config',
        element: <Config />,
      },
      {
        path: 'api-keys',
        element: <ApiKeys />,
      },
    ],
  },
]);
