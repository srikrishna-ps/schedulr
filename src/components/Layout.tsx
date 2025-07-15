import { ReactNode } from 'react';
import { Navigation } from './Navigation';

import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-28">
        <Outlet />
      </main>
    </div>
  );
};
