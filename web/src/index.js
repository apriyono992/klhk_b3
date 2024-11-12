import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { NextUIProvider } from "@nextui-org/react";
import { RouterProvider } from 'react-router-dom';
import router from './services/routes';
import { SWRConfig } from 'swr';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
        <SWRConfig value={{ revalidateOnFocus: false, revalidateOnReconnect: true, keepPreviousData: true }}>
            <NextUIProvider>
                <RouterProvider router={router} />
            </NextUIProvider>
        </SWRConfig>
);
