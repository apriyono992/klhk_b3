import React from 'react';
import ReactDOM from 'react-dom/client';
import DashboardPage from './pages/admin/DashboardPage';
import './index.css';
import {NextUIProvider} from "@nextui-org/react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
const route = createBrowserRouter([
  {
    path: "/",
    element: <div className='min-h-screen'>Halaman Landing Page</div>,
  },
  {
    path: "/admin/dashboard",
    element: <DashboardPage />,
  },
])

root.render(
  <React.StrictMode>
    <NextUIProvider>
      <RouterProvider router={route} />
    </NextUIProvider>
  </React.StrictMode>
);
