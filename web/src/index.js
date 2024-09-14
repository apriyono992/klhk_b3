import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import DashboardPage from './pages/admin/DashboardPage';
import {NextUIProvider} from '@nextui-org/react'
import "./index.css";
import RootAdmin from './RootAdmin';

const root = ReactDOM.createRoot(document.getElementById('root'));
const route = createBrowserRouter([
  {
    path: "/",
    element: <div className='min-h-screen'>Halaman Landing Page</div>,
  },
  {
    path: "/admin/dashboard",
    element: <RootAdmin/>,
    children: [
      {
        path: "/admin/dashboard",
        element: <DashboardPage />,
      },
    ],
  },
])

root.render(
  <React.StrictMode>
    <NextUIProvider>
      <RouterProvider router={route} />
    </NextUIProvider>
  </React.StrictMode>
);
