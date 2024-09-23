import React from 'react';
import ReactDOM from 'react-dom/client';
import DashboardPage from './pages/admin/DashboardPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import './index.css';
import {NextUIProvider} from "@nextui-org/react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RequestPasswordResetPage from './pages/auth/RequestPasswordResetPage';
import PasswordReset from './pages/auth/PasswordReset';

const root = ReactDOM.createRoot(document.getElementById('root'));
const route = createBrowserRouter([
  {
    path: "/",
    element: <div className='min-h-screen'>Halaman Landing Page</div>,
  },
  {
    path: "/login",
    element: <LoginPage/>,
  },
  {
    path: "/register",
    element: <RegisterPage/>,
  },
  {
    path: "/forgot-password/request",
    element: <RequestPasswordResetPage/>,
  },
  {
    path: "/forgot-password/reset",
    element: <PasswordReset/>,
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
