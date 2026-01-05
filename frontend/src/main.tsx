import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './app/router';
import { AppProvider } from './app/providers';
import './index.css';

const rootElement = document.getElementById('root')!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </React.StrictMode>
  );
}
